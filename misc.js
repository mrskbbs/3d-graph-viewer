import * as th from "three";

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
    let bound = Math.round(Number(document.querySelector("#domain").value));
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