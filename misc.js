import * as th from 'three';
import { LoopSubdivision } from 'three-subdivide';
import TextSprite from '@seregpie/three.text-sprite';

//Materials
export const pointsmaterial = new th.PointsMaterial({
    color: "white",
    size: 5,
    sizeAttenuation: false,
});
export const coordsmaterial = new th.LineBasicMaterial({
    color: "white",
    transparent: true,
    opacity: 0.25,
    side: th.DoubleSide,
}); 
export const normalmaterial = new th.MeshNormalMaterial({
    side: th.DoubleSide
});

//Variables
const FORMULADICT = {
    "^" : "**",
    "log": "Math.log",
    "e": "Math.E",
    "pi": "Math.PI",
    "sin": "Math.sin",
    "cos": "Math.cos",
    "tg": "Math.tan",
    "ctg": "Math.cot",
    "tan": "Math.tan",
    "cot": "Math.cot",
    "ln": "Math.log",
};
export let LOWERBOUND = -5; //USER GET
export let UPPERBOUND = 5; //USER GET
export let ROW = 0;
export let TOTAL = 0;

//Display planes
export function planeXY(){
    const arr = [];
    for(var i = LOWERBOUND; i < UPPERBOUND+1; i++){
        const points = [];
        points.push( new th.Vector3( LOWERBOUND, i, 0 ) );
        points.push( new th.Vector3( UPPERBOUND, i, 0 ) );
        const linesGeometry = new th.BufferGeometry().setFromPoints(points);
        const line = new th.Line(
            linesGeometry,
            coordsmaterial,
        );
        line.frustumCulled = false;

        const linesGeometry1 = new th.BufferGeometry().setFromPoints(points);  
        linesGeometry1.rotateZ(Math.PI/2);      
        const line1 = new th.Line(
            linesGeometry1,
            coordsmaterial,
        );
        line1.frustumCulled = false;
        arr.push(line);
        arr.push(line1);
    }
    return arr;
}
export function planeXZ(){
    const arr = [];
    for(var i = LOWERBOUND; i < UPPERBOUND+1; i++){
        const points = [];
        points.push( new th.Vector3( LOWERBOUND, 0, i ) );
        points.push( new th.Vector3( UPPERBOUND, 0, i ) );
        const linesGeometry = new th.BufferGeometry().setFromPoints(points);
        const line = new th.Line(
            linesGeometry,
            coordsmaterial,
        );
        line.frustumCulled = false;

        const linesGeometry1 = new th.BufferGeometry().setFromPoints(points);  
        linesGeometry1.rotateY(Math.PI/2);      
        const line1 = new th.Line(
            linesGeometry1,
            coordsmaterial,
        );
        line1.frustumCulled = false;
        arr.push(line);
        arr.push(line1);
    }
    return arr;
}
export function planeYZ(){
    const arr = [];
    for(var i = LOWERBOUND; i < UPPERBOUND+1; i++){
        const points = [];
        points.push(new th.Vector3(0, LOWERBOUND, i));
        points.push(new th.Vector3(0, UPPERBOUND, i));
        const linesGeometry = new th.BufferGeometry().setFromPoints(points);
        const line = new th.Line(
            linesGeometry,
            coordsmaterial,
        );
        line.frustumCulled = false;

        const linesGeometry1 = new th.BufferGeometry().setFromPoints(points);  
        linesGeometry1.rotateX(Math.PI/2);      
        const line1 = new th.Line(
            linesGeometry1,
            coordsmaterial,
        );
        line1.frustumCulled = false;
        arr.push(line);
        arr.push(line1);
    }
    return arr;
}

//Display mesh indices
function displayIndices(scene, index, vec){
    const l = new TextSprite({
        text: `${index}`,
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: .3,
        position: (vec.normalize().toArray()),
        color: '#ffbbff',
    });
    l.position.x = vec.x;
    l.position.y = vec.y;
    l.position.z = vec.z;
    scene.add(l);
}

function parseFormula(){
    let input = document.querySelector("#formula").value.toLowerCase();
    //Easy parsing
    for(var [key, val] of Object.entries(FORMULADICT)){
       input = input.replaceAll(key, val);
    }
    return input
}

export function createGraph(scene){
    const points = [];
    const indices = [];
    
    //Calculates point coordinates depending on the given function
    for(var y = LOWERBOUND; y < UPPERBOUND; y++){
        ROW = 0;
        for(var x = LOWERBOUND; x < UPPERBOUND; x++){
            var formula = parseFormula();
            if (formula == ""){
                return {
                    mesh: null,
                    cloud: null,
                }
            }
            try{
                var z = eval(formula);
            }catch{
                alert(`Формула \"${formula}\" была введена неверно!`);
                return {
                    mesh: null,
                    cloud: null,
                };
            }
            if(z != NaN){
                points.push(x,y,z);
                // const l = new TextSprite({
                //     text: `${TOTAL}`,
                //     fontFamily: 'Arial, Helvetica, sans-serif',
                //     fontSize: .3,
                //     position: ((new th.Vector3(x,y,z)).normalize().toArray()),
                //     color: '#ffbbff',
                // });
                // l.position.x = x;
                // l.position.y = y;
                // l.position.z = z;
                // scene.add(l);
                TOTAL++;
                ROW++;
            }
        }
    }

    //Builds triangle indices order from cloud of points
    for(var y = 0; y < (TOTAL/(ROW))-1; y++){
        for(var x = 0; x < ROW-1; x++){
            indices.push(x + y*ROW, x+1 + y*ROW, x + (y+1)*ROW);
            indices.push(x + (y+1)*ROW, x+1 + y*ROW, x+1 + (y+1)*ROW);
        }
    }    
    const vertices = new Float32Array(points);

    //Geometry creation from vertices
    const geometry = new th.BufferGeometry();
    geometry.setAttribute('position', new th.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Create mesh and clouds
    const mesh = new th.Mesh(geometry, normalmaterial);
    const cloud = new th.Points(geometry, pointsmaterial);

    return {
        mesh: mesh,
        cloud: cloud,
    };
}