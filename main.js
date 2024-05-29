import * as th from 'three';
import {OrbitControls} from 'three/examples/jsm/Addons.js';
import { Graph } from './graph.js';
import { Plane } from './plane.js';

//Display loop
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function showPlanes(){
    if(plane_xy.isChecked()){
        plane_xy.show();
    }
    if(plane_xz.isChecked()){
        plane_xz.show();
    }
    if(plane_yz.isChecked()){
        plane_yz.show();
    }
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
let plane_xy = new Plane(scene, "xy");
let plane_xz = new Plane(scene, "xz");
let plane_yz = new Plane(scene, "yz");
showPlanes();
scene.add(axes);

const ambient_light = new th.AmbientLight("#919191"); 
scene.add( ambient_light );

const directonal_light = new th.DirectionalLight(0xffffff, .6);
directonal_light.position.z = 20;
scene.add(directonal_light);

//Init grapgh
let graph = undefined;

const DOM_renderer = document.querySelector("#renderer");
DOM_renderer.appendChild(renderer.domElement);
animate(scene, camera, renderer);

document.querySelector("#domain").addEventListener("change", () => {
    plane_xy.del();
    plane_xy = new Plane(scene, "xy");
    plane_xz.del();
    plane_xz = new Plane(scene, "xz");
    plane_yz.del();
    plane_yz = new Plane(scene, "yz");
    showPlanes();
});

//Display button
const button_display = document.querySelector("#add");
button_display.addEventListener("click", ()=>{
    graph = new Graph(scene);
});
