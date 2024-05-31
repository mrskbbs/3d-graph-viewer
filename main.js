import * as th from 'three';
import {OrbitControls} from 'three/examples/jsm/Addons.js';
import { Graph } from './classes/graph.js';
import { Plane } from './classes/plane.js';

//Display loop
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

//Render visible planes
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


//Light setup
const ambient_light = new th.AmbientLight("#919191"); 
scene.add( ambient_light );

const top_light = new th.DirectionalLight(0xffffff, .6);
top_light.position.z = 30;
scene.add(top_light);

const bottom_light = new th.DirectionalLight(0xffffff, .6);
bottom_light.position.z = -30;
scene.add(bottom_light)

//Camera controls setup
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
let graph = undefined;

//Renderer init
const DOM_renderer = document.querySelector("#renderer");
DOM_renderer.appendChild(renderer.domElement);
animate(scene, camera, renderer);

//Update domain planes dynamically
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
