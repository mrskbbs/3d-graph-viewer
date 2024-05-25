import * as th from 'three';
import * as misc from './misc.js';
export class Graph{
    #geometry;
    #mesh;
    #cloud;
    #scene;
    #checkbox;
    //Parse formula and edit it to suit JS syntax
    #parseFormula(){
        let input = document.querySelector("#formula").value.toLowerCase();

        for(var [key, val] of Object.entries(misc.FORMULADICT)){
           input = input.replaceAll(key, val);
        }

        //Error validation
        var x = 0, y = 0, z = 0;
        try{
            z = eval(input);
        }catch{
            alert(`Формула \"${input}\" была введена неверно!`);
            return null;
        }
        
        return input;
    }
    constructor(scene){
        this.#scene = scene;
        this.#checkbox = document.querySelector("#cloud");
        this.#checkbox.addEventListener('change', (el) => {
            if(el.currentTarget.checked){
                this.showCloud();
            }else{
                this.hideCloud();
            }
        });

        const bounds = misc.parseLowerUpperBounds();
        const points = [];
        const indices = [];
        const ROW = bounds.upper - bounds.lower;
        const TOTAL = ROW*ROW;

        var x = 0, y = 0, z = 0;

        var formula = this.#parseFormula();
        if(formula == null){
            this.#mesh = null;
            this.#cloud = null;
            this.#geometry = null;
            return;
        }
       
        //Calculates point coordinates depending on the given function
        for(var y = bounds.lower; y < bounds.upper; y++){
            for(var x = bounds.lower; x < bounds.upper; x++){
                z = eval(formula);
                if(z != NaN) points.push(x,y,z);
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
        this.#geometry = new th.BufferGeometry();
        this.#geometry.setAttribute('position', new th.BufferAttribute(vertices, 3));
        this.#geometry.setIndex(indices);
        this.#geometry.computeVertexNormals();
    
        // Create mesh and clouds
        this.#mesh = new th.Mesh(this.#geometry, misc.normalmaterial);
        this.#cloud = new th.Points(this.#geometry, misc.pointsmaterial);
    }
    isCloudVisible(){
        return this.#checkbox.checked;
    }
    showMesh(){
        this.#scene.add(this.#mesh);
    }
    hideMesh(){
        this.#scene.remove(this.#mesh);
    }
    showCloud(){
        this.#scene.add(this.#cloud);
    }
    hideCloud(){
        this.#scene.remove(this.#cloud)
    }
    del(){
        if(this.#mesh != null){
            this.#mesh.geometry.dispose();
            this.#scene.remove(this.#mesh);
        }
        if(this.#checkbox.checked && this.#cloud != null){
            this.#cloud.geometry.dispose();
            this.#scene.remove(this.#cloud);
        }
    }
}