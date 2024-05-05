import * as th from 'three';
import { FBXLoader, FontLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import TextSprite from '@seregpie/three.text-sprite';
import { LoopSubdivision } from 'three-subdivide';

function animate(){
    // console.log(cube.rotation);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

const scene = new th.Scene();
const camera = new th.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight, 
    0.1, 
    2000
);
camera.position.z = 5;

const geometry = new th.BufferGeometry();
const LOWERBOUND = -10;
const UPPERBOUND = 10;
let ROW = 0;
let TOTAL = 0;

const points = [];
const indices = [];
for(var y = LOWERBOUND; y < UPPERBOUND; y++){
    ROW = 0;
    for(var x = LOWERBOUND; x < UPPERBOUND; x++){
        var z = Math.log(x*x*y + 1) + y;//x*y + x*x - 3*x*x*y;
        if(z != NaN){
            points.push(x,y,z);
            const l = new TextSprite({
                text: `${TOTAL}`,//`${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)}`,
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: .3,
                position: ((new th.Vector3(x, y, z)).normalize().toArray()),
                color: '#ffbbff',
            });
            TOTAL++;
            ROW++;
            l.position.x = x;
            l.position.y = y;
            l.position.z = z;
            scene.add(l);
        }
    }
}
console.log(ROW);

for(var y = 0; y < (TOTAL/(ROW))-1; y++){
    for(var x = 0; x < ROW-1; x++){
        indices.push(x + y*ROW, x+1 + y*ROW, x + (y+1)*ROW);
        indices.push(x + (y+1)*ROW, x+1 + y*ROW, x+1 + (y+1)*ROW);
    }
}


const vertices = new Float32Array(points);

// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute( 'position', new th.BufferAttribute( vertices, 3 ) );
geometry.setIndex(indices);
geometry.computeVertexNormals();
const params = {
    split:          true,       // optional, default: true
    uvSmooth:       false,      // optional, default: false
    preserveEdges:  false,      // optional, default: false
    flatOnly:       false,      // optional, default: false
    maxTriangles:   Infinity,   // optional, default: Infinity
};

const SUBDgeometry = LoopSubdivision.modify(geometry, 0, params);

const material = new th.PointsMaterial({
    color: "white",
    size: 2,
    sizeAttenuation: false,
});
const meshmaterial = new th.MeshPhysicalMaterial({
    color: "white",
    side: th.DoubleSide,
});
const normalmaterial = new th.MeshNormalMaterial({side: th.DoubleSide});
const mesh = new th.Mesh(SUBDgeometry, normalmaterial);
const cloud = new th.Points(geometry, material);
const light = new th.DirectionalLight(0xffffff, 1.2);
light.rotation.set(new th.Vector3(0, 0, Math.PI/6));
light.position.set(0, 2, 3);
scene.add(light);
scene.add(mesh);
scene.add(cloud);
// scene.add(cube);
const renderer = new th.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = th.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
const DOMrenderer = document.querySelector("#renderer");
DOMrenderer.appendChild(renderer.domElement);

animate();
