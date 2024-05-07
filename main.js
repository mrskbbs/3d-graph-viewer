import * as th from 'three';
import {OrbitControls} from 'three/examples/jsm/Addons.js';
import * as misc from './misc.js';

//Display loop
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

//Camera and scene setup
const scene = new th.Scene();
const camera = new th.PerspectiveCamera(
    75,
    WIDTH/HEIGHT, 
    0.1, 
    2000
);
camera.up.set(0,0,1);
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;
camera.rotateY(Math.PI/3);
camera.rotateX(Math.PI/3);


//Renderer setup
const renderer = new th.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = th.PCFSoftShadowMap;
renderer.setSize(WIDTH, HEIGHT);

//Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//Plane setup
const axes = new th.AxesHelper(5);
let plane_xy = misc.planeXY();
let plane_xz = misc.planeXZ();
let plane_yz = misc.planeYZ();
scene.add(axes);

//Init grapgh
let graph = {
    mesh: null,
    cloud: null,
};

const DOM_renderer = document.querySelector("#renderer");
DOM_renderer.appendChild(renderer.domElement);
animate(scene, camera, renderer);


//Checkboxes
const checkbox_cloud = document.querySelector("#cloud");
checkbox_cloud.addEventListener('change', function(){
    if(this.checked){
        scene.add(graph.cloud);
    }else{
        scene.remove(graph.cloud);
    }
});
const checkbox_xy = document.querySelector("#plane-xy");
checkbox_xy.addEventListener('change', function(){
    if(this.checked){
        for(var el of plane_xy){
            scene.add(el);
        }
    }else{
        for(var el of plane_xy){
            scene.remove(el);
        }
    }
});
const checkbox_xz = document.querySelector("#plane-xz");
checkbox_xz.addEventListener('change', function(){
    if(this.checked){
        for(var el of plane_xz){
            scene.add(el);
        }
    }else{
        for(var el of plane_xz){
            scene.remove(el);
        }
    }
});
const checkbox_yz = document.querySelector("#plane-yz");
checkbox_yz.addEventListener('change', function(){
    if(this.checked){
        for(var el of plane_yz){
            scene.add(el);
        }
    }else{
        for(var el of plane_yz){
            scene.remove(el);
        }
    }
});

function clearPlanes(planes){
    for(var plane of planes){
        for(var el of plane){
            el.geometry.dispose();
            scene.remove(el);
        }
    }
}
function showPlanes(planes){
    if(checkbox_xy.checked){
        for(var el of plane_xy) scene.add(el);
    }
    if(checkbox_xz.checked){
        for(var el of plane_xz) scene.add(el);
    }
    if(checkbox_yz.checked){
        for(var el of plane_yz) scene.add(el);
    }
}

//Display button
const button_display = document.querySelector("#display");
button_display.addEventListener("click", ()=>{
    if(graph.mesh != null){
        graph.mesh.geometry.dispose();
        scene.remove(graph.mesh);
    }
    if(checkbox_cloud.checked && graph.cloud != null){
        graph.cloud.geometry.dispose();
        scene.remove(graph.cloud)
    };
    graph = misc.createGraph(scene);
    scene.add(graph.mesh);
    if(checkbox_cloud.checked) scene.add(graph.cloud);
    clearPlanes([plane_xy, plane_xz, plane_yz]);
    plane_xy = misc.planeXY();
    plane_xz = misc.planeXZ();
    plane_yz = misc.planeYZ();
    showPlanes();
});
