import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/GLTFLoader.js';

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;

let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
scene.add(light);

let loader = new GLTFLoader();

let model, originalSize;
let scale = 1;

loader.load('sofa-base.glb', (gltf)=>{
    model = gltf.scene;
    scene.add(model);
    getSize();
});

function getSize(){
    let box = new THREE.Box3().setFromObject(model);
    let size = new THREE.Vector3();
    box.getSize(size);

    originalSize = size;
    updateUI(size);
}

function updateUI(size){
    document.getElementById('w').innerText = (size.x*100).toFixed(1);
    document.getElementById('h').innerText = (size.y*100).toFixed(1);
    document.getElementById('d').innerText = (size.z*100).toFixed(1);
}

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

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();