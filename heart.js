// SETTINGS
let pulseSpeed = 1.5;
let pulseOn = true;

// SCENE SETUP
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

// LIGHTS
let ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
let point = new THREE.PointLight(0xff3366, 2, 100);
point.position.set(5,5,5);
scene.add(point);

// HEART GEOMETRY
function createSolidHeart() {
  let shape = new THREE.Shape();
  shape.moveTo(0,0);
  shape.bezierCurveTo(0,0,-1,-1,-2,0);
  shape.bezierCurveTo(-3,1,-3,3,0,5);
  shape.bezierCurveTo(3,3,3,1,2,0);
  shape.bezierCurveTo(1,-1,0,0,0,0);
  return new THREE.ExtrudeGeometry(shape, { depth:1, bevelEnabled:true });
}

let heartGeometry = createSolidHeart();
let heartMaterial = new THREE.MeshPhongMaterial({ color:0xff3366, shininess:100, specular:0xffcccc });
let heart = new THREE.Mesh(heartGeometry, heartMaterial);
heart.scale.set(0.4,0.4,0.4);
heart.position.set(0,0,0);
scene.add(heart);

// FLOATING HEARTS
let floatingHearts = [];
for(let i=0;i<30;i++){
  let geom = new THREE.SphereGeometry(0.05,8,8);
  let mat = new THREE.MeshPhongMaterial({ color:0xff6699 });
  let mesh = new THREE.Mesh(geom, mat);
  mesh.position.set((Math.random()-0.5)*10, Math.random()*5-2, (Math.random()-0.5)*5);
  scene.add(mesh);
  floatingHearts.push(mesh);
}

// HEART TEXT (HTML overlay with emojis)
let heartTextDiv = document.createElement("div");
heartTextDiv.style.position = "absolute";
heartTextDiv.style.top = "50%";
heartTextDiv.style.left = "50%";
heartTextDiv.style.transform = "translate(-50%, -50%)";
heartTextDiv.style.color = "#ffff66";
heartTextDiv.style.fontSize = "18px";
heartTextDiv.style.fontWeight = "bold";
heartTextDiv.style.textAlign = "center";
heartTextDiv.style.whiteSpace = "pre-line";
heartTextDiv.style.display = "none"; // hidden initially
heartTextDiv.innerHTML = `You're my Honeybunch ❤️
Sugarplum ❤️
Pumpy-umpy-umpkin ❤️
You're my Sweetie Pie ❤️
You're my Cuppycake ❤️
Gumdrop ❤️
Snoogums-Boogums ❤️
You're the Apple of my eye ❤️
And I love you so ❤️
I want you to know ❤️
That I'll always be right here ❤️
And I love to sing sweet songs to you ❤️
Because you are so dear ❤️`;
document.body.appendChild(heartTextDiv);

// ANIMATION FLAGS
let open = false;

// ANIMATION LOOP
let clock = new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  let t = clock.getElapsedTime();

  // Heart pulse
  if(pulseOn){
    heart.scale.set(0.4 + 0.05*Math.sin(t*pulseSpeed), 0.4 + 0.05*Math.sin(t*pulseSpeed), 0.4);
  }

  // Floating hearts animation
  floatingHearts.forEach(h=>{
    h.position.y += 0.01;
    if(h.position.y>5) h.position.y=-2;
  });

  // Heart popup scaling
  if(open){
    heart.scale.set(0.6,0.6,0.6);
    heartTextDiv.style.display = "block";
  } else {
    heart.scale.set(0.4,0.4,0.4);
    heartTextDiv.style.display = "none";
  }

  renderer.render(scene, camera);
}
animate();

// BUTTONS
let playBtn = document.getElementById("playBtn");
let pulseBtn = document.getElementById("pulseBtn");
let resetBtn = document.getElementById("resetBtn");
let letterBtn = document.getElementById("letterBtn");
let closeModal = document.getElementById("closeModal");
let musicIframe = document.getElementById("musicPlayer");

// ✅ MUSIC FIX STARTS HERE
let musicPlayer;
function onYouTubeIframeAPIReady() {
  musicPlayer = new YT.Player('musicPlayer');
}

let musicPlaying = false;
playBtn.onclick = () => {
  if(!musicPlaying){
    musicPlayer.playVideo();
    musicPlaying = true;
    playBtn.textContent = "🎵 Pause";
  } else {
    musicPlayer.pauseVideo();
    musicPlaying = false;
    playBtn.textContent = "🎵 Play";
  }
};
// ✅ MUSIC FIX ENDS HERE

// Open/close heart
pulseBtn.onclick = () => { open = !open; };

// Reset view
resetBtn.onclick = () => { camera.position.set(0,0,5); controls.update(); };

// Letter modal
letterBtn.onclick = () => { document.getElementById("letterModal").style.display="block"; };
closeModal.onclick = () => { document.getElementById("letterModal").style.display="none"; };

// RESPONSIVE
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
