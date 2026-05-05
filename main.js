import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

let camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// luz
let light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(2, 2, 2);
scene.add(light);

// CUBO DE TESTE
let geometry = new THREE.BoxGeometry(1,1,1);
let material = new THREE.MeshStandardMaterial({color: 0x00ff00});
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// animação
function animate(){
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
