// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create the renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Create the audio context
const audioContext = new AudioContext();

// Create the analyser node
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

// Connect the microphone to the analyser node
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
});

// Update the sphere based on the audio data
const dataArray = new Float32Array(analyser.frequencyBinCount);
const updateSphere = () => {
  requestAnimationFrame(updateSphere);

  // Get the audio data
  analyser.getFloatFrequencyData(dataArray);

  // Adjust the sphere based on the audio data
  const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
  sphere.scale.set(1 + average / 100, 1 + average / 100, 1 + average / 100);
};
updateSphere();


// Animate the sphere
const animate = () => {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
};
animate();
