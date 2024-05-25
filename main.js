import * as th from 'three';
import {OrbitControls} from 'three/examples/jsm/Addons.js';
import { Graph } from './graph.js';
import { Plane } from './plane.js';

//Display loop
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
//Plane functions
function hidePlanes(){
    plane_xy.hide();
    plane_xz.hide();
    plane_yz.hide();
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

//Init grapgh
let graph = new Graph(scene);
graph.showMesh();

const DOM_renderer = document.querySelector("#renderer");
DOM_renderer.appendChild(renderer.domElement);
animate(scene, camera, renderer);

//Display button
const button_display = document.querySelector("#display");
button_display.addEventListener("click", ()=>{
    graph.del();
    graph = new Graph(scene);
    graph.showMesh();
    if(graph.isCloudVisible()) graph.showCloud();
    hidePlanes();
    plane_xy = new Plane(scene, "xy");
    plane_xz = new Plane(scene, "xz");
    plane_yz = new Plane(scene, "yz");
    showPlanes();
});
