let scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

let camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// luz FORTE (sem erro de iluminação)
let light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(5,5,5);
scene.add(light);

// grid
let grid = new THREE.GridHelper(10, 10);
scene.add(grid);

let loader = new THREE.GLTFLoader();

let model;
let scale = 1;
let originalSize;

loader.load(
  'sofa-base.glb',

  function(gltf){
    console.log("MODELO CARREGADO");

    model = gltf.scene;
    scene.add(model);

    // FORÇA VISIBILIDADE TOTAL
    model.scale.set(0.01, 0.01, 0.01);
    model.position.set(0, 0, 0);

    // MATERIAL FORÇADO (SEMPRE APARECE)
    model.traverse(function(child){
        if(child.isMesh){
            child.material = new THREE.MeshNormalMaterial();
        }
    });

    // MEDIÇÃO
    let box = new THREE.Box3().setFromObject(model);
    let size = new THREE.Vector3();
    box.getSize(size);

    originalSize = size;
    updateUI(size);

    // CÂMERA FIXA
    camera.position.set(0, 1, 3);
    camera.lookAt(0,0,0);
  },

  undefined,

  function(error){
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
function scaleUp(){
    scale += 0.1;
    apply();
}

function scaleDown(){
    scale -= 0.1;
    if(scale < 0.1) scale = 0.1;
    apply();
}

function apply(){
    if(!model) return;

    model.scale.set(scale*0.01, scale*0.01, scale*0.01);

    let newSize = originalSize.clone().multiplyScalar(scale);
    updateUI(newSize);
}

// render
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
