<template>
  <div >
    <div >
      <div class=" bg-slate-50 h-[75vh] m-5 shadow-gray-500 shadow-xl flex-1">
        <div v-if="detected" class="flex justify-center">
          <span class="w-40 text-xs font-medium px-10 py-2 mt-5 bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-300"> Terdeteksi </span>
        </div>
        
        <div v-else class="flex justify-center">
          <span class="w-40 text-xs font-medium px-10 py-2 mt-5 dark:bg-red-900 dark:text-red-300 rounded-full"> Gagal Deteksi </span>
        </div>
        <div class="m-5 h-[50vh] shadow-xl flex-1  bg-black flex justify-center">
          <div id="webcam-container" class="mt-10">
            <div id="label-container" class="text-white text-center"></div>
          </div>
        </div>
        <div class="flex justify-center">
          <button v-if="!isStarted" class="w-40 text-dark text-md font-medium py-1  rounded-md  text-black bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline" type="button" @click="init()">Presensi</button>
          <button v-if="classNameDetected != null && classNameDetected != ''" class="w-40 bg-green-700 text-dark text-md font-medium  py-1 rounded-md hover:bg-green-900 text-white focus:outline-none focus:shadow-outline" type="button" @click="handleButtonClick">
            Send Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// const URL = "./public/tm-my-image-model/";
const URL = "https://teachablemachine.withgoogle.com/models/W5rqMFDw8/";

let model, webcam, labelContainer, maxPredictions;
let results = [];
let detected = ref(false);
let isStarted = ref(false);
let classNameDetected = ref("");

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);
  isStarted.value = true;

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability >= 0.9) {
      if (prediction[i].className != "null") {
        detected.value = true;
        labelContainer.innerHTML = prediction[i].className;
        classNameDetected.value = prediction[i].className;
        break;
      }
    } else {
      detected.value = false;
      labelContainer.innerHTML = "Dekatkan lagi wajah kamu!!";
      classNameDetected.value = "";
    }
  }
  results = prediction;
}

const supabase = useSupabaseClient();
async function sendDataToSupabase(prediction) {
  if (!prediction) {
    console.error("Invalid prediction data");
    return;
  }

  // Log data yang akan dikirim
  console.log("Sending data:", {
    nama: classNameDetected.value,
  });

  const { data, error } = await supabase.from("siswa").insert([
    {
      nama: classNameDetected.value,
    },
  ]);

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Data inserted:", data);
  }
}

async function handleButtonClick() {
  if (!results.length) {
    console.error("No prediction available");
    return;
  }
  await sendDataToSupabase(results);
}
</script>
