import * as th from 'three';
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
//Default params
export let LOWERBOUND = -10; 
export let UPPERBOUND = 10; 

//Display planes
export function planeXY(){
    const arr = [];
    for(var i = LOWERBOUND; i < UPPERBOUND+1; i++){
        const points = [];
        const points1 = [];

        points.push( new th.Vector3( LOWERBOUND, i, 0 ) );
        points.push( new th.Vector3( UPPERBOUND, i, 0 ) );
        points1.push( new th.Vector3( i, LOWERBOUND, 0 ) );
        points1.push( new th.Vector3( i, UPPERBOUND, 0 ) );
        
        const linesGeometry = new th.BufferGeometry().setFromPoints(points);
        const linesGeometry1 = new th.BufferGeometry().setFromPoints(points1);
        const line = new th.Line(
            linesGeometry,
            coordsmaterial,
        );
        const line1 = new th.Line(
            linesGeometry1,
            coordsmaterial,
        );
        line.frustumCulled = false;
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
        const points1 = [];

        points.push(new th.Vector3(LOWERBOUND, 0, i));
        points.push(new th.Vector3(UPPERBOUND, 0, i));
        points1.push(new th.Vector3(i, 0, LOWERBOUND));
        points1.push(new th.Vector3(i, 0, UPPERBOUND));
        
        const linesGeometry = new th.BufferGeometry().setFromPoints(points);
        const linesGeometry1 = new th.BufferGeometry().setFromPoints(points1);
        const line = new th.Line(
            linesGeometry,
            coordsmaterial,
        );
        const line1 = new th.Line(
            linesGeometry1,
            coordsmaterial,
        );
        line.frustumCulled = false;
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
        const points1 = [];

        points.push(new th.Vector3(0, LOWERBOUND, i));
        points.push(new th.Vector3(0, UPPERBOUND, i));
        points1.push(new th.Vector3(0, i, LOWERBOUND));
        points1.push(new th.Vector3(0, i, UPPERBOUND));
        
        const linesGeometry = new th.BufferGeometry().setFromPoints(points);
        const linesGeometry1 = new th.BufferGeometry().setFromPoints(points1);
        const line = new th.Line(
            linesGeometry,
            coordsmaterial,
        );
        const line1 = new th.Line(
            linesGeometry1,
            coordsmaterial,
        );
        line.frustumCulled = false;
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

//Parse formula and edit it to suit JS syntax
function parseFormula(){
    let input = document.querySelector("#formula").value.toLowerCase();
    //Easy parsing
    for(var [key, val] of Object.entries(FORMULADICT)){
       input = input.replaceAll(key, val);
    }
    return input
}

//Parse lower and upper bounds for coords
function parseLowerUpperBounds(){
    let lower = Number(document.querySelector("#lower").value);
    let upper = Number(document.querySelector("#upper").value);

    if(lower >= upper){
        alert("Неверно введены границы!");
        return;
    }

    LOWERBOUND = lower;
    UPPERBOUND = upper;
}

//Create graph mesh and points cloud
export function createGraph(){
    const points = [];
    const indices = [];
    parseLowerUpperBounds();
    let TOTAL = 0;
    let ROW = 0;
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