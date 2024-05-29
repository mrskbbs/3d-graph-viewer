import * as th from 'three';

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
export function parseLowerUpperBounds(){
    let lower = Number(document.querySelector("#lower").value);
    let upper = Number(document.querySelector("#upper").value);

    if(lower >= upper){
        alert("Неверно введены границы!");
        return;
    }
    return{
        lower: lower,
        upper: upper,
    }
}

export function elementBuilder(tag, options){
    const el = document.createElement(tag);
    for(const [key, val] of Object.entries(options)){
        el.setAttribute(key, val);
    }
    return el;
}

export function materialBuilder(val){
    return new th.MeshPhysicalMaterial({
        color: val,
        side: th.DoubleSide,
    });
}