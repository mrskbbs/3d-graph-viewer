<<<<<<< HEAD:misc.js
import * as th from "https://unpkg.com/browse/three@0.164.1/build/three.module.js";
=======
import * as th from "../node_modules/three/build/three.module.js";
>>>>>>> da6204240f1a8c1bd0067a2acacea12b018f1668:dist/misc.js

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
export const FORMULADICT = {
    "^" : "**",
    "log": "Math.log",
    "e": "Math.E",
    "pi": "Math.PI",
    "sin": "Math.sin",
    "cos": "Math.cos",
    "tan": "Math.tan",
    "cot": "Math.cot",
    "tg": "Math.tan",
    "ctg": "Math.cot",
    "ln": "Math.log",
};

//Parse lower and upper bounds for coords
export function parseBounds(){
    var bound = Math.round(Number(document.querySelector("#domain").value));
    bound = (bound < 1) ? 1 : bound;
    return{
        lower: -1*bound,
        upper: bound,
    }
}

export function elementBuilder(tag, options){
    const el = document.createElement(tag);
    for(const [key, val] of Object.entries(options)){
        el.setAttribute(key, val);
    }
    return el;
}