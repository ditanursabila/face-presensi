<template>
  <div>
    <div>
      <div v-if="detected">
        <span class="text-xs font-medium px-10 py-2 ms-48 mt-4 bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-300"> Terdeteksi </span>
      </div>
      <div v-else>
        <span class="text-xs font-medium px-10 py-2 ms-48 mt-4 dark:bg-red-900 dark:text-red-300 rounded-full"> Gagal Deteksi </span>
      </div>

      <div class="overflow-auto border border-black p-4 m-5 shadow-xl flex-1">
        <div class="w-full md:h-[320px] bg-black flex items-center justify-center">
          <div id="webcam-container"></div>
        </div>
        <div id="label-container"></div>
      </div>
    </div>
    <button v-if="!isStarted" class="bg-blue-100 text-dark text-md font-medium px-10 py-2 ms-48 mt-4 rounded-md dark:bg-blue-800 text-black" type="button" @click="init()">Presensi</button>
    <button v-if="classNameDetected != null && classNameDetected != ''" class="bg-green-100 text-dark text-md font-medium px-10 py-2 ms-48 mt-4 rounded-md dark:bg-green-900 dark:text-green-300" type="button" @click="handleButtonClick">
      Send Data
    </button>
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
