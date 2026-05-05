import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/GLTFLoader.js';

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

let camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 3);

let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// luz mais forte
let light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
scene.add(light);

// helper (pra saber se tá funcionando)
let grid = new THREE.GridHelper(10, 10);
scene.add(grid);

let loader = new GLTFLoader();

let model, originalSize;
let scale = 1;

loader.load(
'https://modelviewer.dev/shared-assets/models/Astronaut.glb'

  (gltf)=>{
    console.log("MODELO CARREGADO");

    model = gltf.scene;
    scene.add(model);

    model.position.set(0,0,0);

    getSize();
  },

  undefined,

  (error)=>{
    console.error("ERRO AO CARREGAR:", error);
  }
);

// medir
function getSize(){
    let box = new THREE.Box3().setFromObject(model);
    let size = new THREE.Vector3();
    box.getSize(size);

    originalSize = size;

    updateUI(size);
}

// UI
function updateUI(size){
    document.getElementById('w').innerText = (size.x*100).toFixed(1);
    document.getElementById('h').innerText = (size.y*100).toFixed(1);
    document.getElementById('d').innerText = (size.z*100).toFixed(1);
}

// escala
window.scaleUp = ()=>{
    scale += 0.1;
    apply();
}

window.scaleDown = ()=>{
    scale -= 0.1;
    if(scale<0.1) scale=0.1;
    apply();
}

function apply(){
    model.scale.set(scale,scale,scale);

    let newSize = originalSize.clone().multiplyScalar(scale);
    updateUI(newSize);
}

// render
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
