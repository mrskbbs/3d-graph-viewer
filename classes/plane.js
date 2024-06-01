import * as th from "three";
import * as misc from "../misc.js";
export class Plane{
    #lines = [];
    #scene;
    #checkbox;
    
    //Automatic creation of plane geometry
    #constructGeometry(orient){
        this.#lines = [];
        const bounds = misc.parseBounds();
        
        let x = 0, y = 0, z = 0;
        let x1 = 0, y1 = 0, z1 = 0;


        for(let i = bounds.lower; i <= bounds.upper; i++){
            const points = [];
            const points1 = [];
            
            switch(orient){
                case "xy":
                    y = y1 = i;
                    x = bounds.lower;
                    x1 = bounds.upper;
                    break;
                case "xz":
                    z = z1 = i;
                    x = bounds.lower;
                    x1 = bounds.upper;
                    break;
                case "yz":
                    z = z1 = i;
                    y = bounds.lower;
                    y1 = bounds.upper;
                    break;
            }

            points.push(new th.Vector3(x, y, z));
            points.push(new th.Vector3(x1, y1, z1));

            switch(orient){
                case "xy":
                    [x, y] = [y, x];
                    [x1, y1] = [y1, x1];
                    break;
                case "xz":
                    [x, z] = [z, x];
                    [x1, z1] = [z1, x1];
                    break;
                case "yz":
                    [y, z] = [z, y];
                    [y1, z1] = [z1, y1];
                    break;
            }

            points1.push(new th.Vector3(x, y, z));
            points1.push(new th.Vector3(x1, y1, z1));

            const linesGeometry = new th.BufferGeometry().setFromPoints(points);
            const linesGeometry1 = new th.BufferGeometry().setFromPoints(points1);
            
            const line = new th.Line(
                linesGeometry,
                misc.coordsmaterial,
            );
            const line1 = new th.Line(
                linesGeometry1,
                misc.coordsmaterial,
            );

            line.frustumCulled = false;
            line1.frustumCulled = false;

            this.#lines.push(line);
            this.#lines.push(line1);
        } 
    }

    constructor(scene, orient){
        this.#scene = scene;
        orient = orient.trim().toLowerCase();

        this.#checkbox = document.querySelector("#plane-"+orient);
        this.#checkbox.addEventListener("change", (el) => {
            if(el.currentTarget.checked){
                this.show();
            }else{
                this.hide();
            }
        });

        this.#constructGeometry(orient);
    }
    isChecked(){
        return this.#checkbox.checked;
    }
    show(){
        for(let el of this.#lines){
            this.#scene.add(el);
        }
    }
    hide(){
        for(let el of this.#lines){
            this.#scene.remove(el);
        }
    }
    del(){
        for(let el of this.#lines){
            el.geometry.dispose();
            this.#scene.remove(el);
            this.#lines = [];
        }
    }
}