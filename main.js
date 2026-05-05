import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

let camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// luz
let light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5,5,5);
scene.add(light);

// grid
let grid = new THREE.GridHelper(10, 10);
scene.add(grid);

let loader = new GLTFLoader();

let model, originalSize;
let scale = 1;

loader.load(
  './sofa-base.glb',

  (gltf)=>{
    console.log("MODELO CARREGADO");

    model = gltf.scene;
    scene.add(model);

    // centralizar
    let box = new THREE.Box3().setFromObject(model);
    let center = new THREE.Vector3();
    box.getCenter(center);
    model.position.sub(center);

    let size = new THREE.Vector3();
    box.getSize(size);

    originalSize = size;
    updateUI(size);

    // câmera automática
    let maxDim = Math.max(size.x, size.y, size.z);
    let distance = maxDim * 2;

    camera.position.set(0, size.y, distance);
    camera.lookAt(0,0,0);
  },

  undefined,

  (error)=>{
    console.error("ERRO AO CARREGAR:", error);
  }
);

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
    if(scale < 0.1) scale = 0.1;
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
