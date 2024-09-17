<template>
  <div>
    <div>
      <div v-if="detected">
        <span class="mt-5 mb-5 inline-flex items-center md:ms-[250px] bg-green-100 text-green-800 text-xs font-medium px-5 py-1.5 rounded-full dark:bg-green-900 dark:text-green-300">
          <span class="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
          Terdeteksi
        </span>
      </div>
      <div v-else>
        <span class="mt-5 mb-5 inline-flex items-center m-48 bg-red-100 text-red-800 text-xs font-medium px-5 py-1.5 rounded-full dark:bg-red-900 dark:text-red-300">
          <span class="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
          Gagal Deteksi
        </span>
      </div>
    </div>

    <div class="border border-black p-4 ms-10">
      <div class="flex">
        <div class="w-full md:h-[320px] bg-black flex items-center justify-center">
          <div id="webcam-container"></div>
        </div>
      </div>
      <div id="label-container"></div>
    </div>
    <button v-if="!isStarted" class="bg-blue-100 text-dark text-xs font-medium px-10 py-2 ms-48 mt-4 rounded-md dark:bg-red-900 dark:text-red-300" type="button" @click="init()">Presensi</button>
    <button v-if="detected" class="bg-green-100 text-dark text-xs font-medium px-10 py-2 ms-48 mt-4 rounded-md dark:bg-green-900 dark:text-green-300" type="button" @click="handleButtonClick">Send Data</button>
  </div>
</template>

<script setup>
// const URL = "./public/tm-my-image-model/";
const URL = "https://teachablemachine.withgoogle.com/models/W5rqMFDw8/";

let model, webcam, labelContainer, maxPredictions;
let results = [];
let detected = ref(false);
let isStarted = ref(false);

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
  // for (let i = 0; i < maxPredictions; i++) {
  //   const classPrediction =
  //     prediction[i].className + ": " + prediction[i].probability.toFixed(2);
  //   labelContainer.childNodes[i].innerHTML = classPrediction;
  // }
  results = prediction;
  if (prediction[0].probability >= 0.9) {
    detected.value = true;
    labelContainer.innerHTML = prediction[0].className;
  } else {
    detected.value = false;
    labelContainer.innerHTML = "Dekatkan lagi wajah kamu!!";
  }
}

const supabase = useSupabaseClient();
async function sendDataToSupabase(prediction) {
  if (!prediction || !prediction[0]) {
    console.error("Invalid prediction data");
    return;
  }

  // Log data yang akan dikirim
  console.log("Sending data:", {
    nama: prediction[0].className,
  });

  const { data, error } = await supabase.from("siswa").insert([
    {
      nama: prediction[0].className,
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
