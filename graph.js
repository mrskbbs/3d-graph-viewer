import * as th from 'three';
import * as misc from './misc.js';
export class Graph{
    #scene;
    #geometry;

    #mesh;
    #mesh_checkbox;
    
    #cloud;
    #cloud_checkbox;
    
    #card;

    //Parse formula and edit it to suit JS syntax
    #parseFormula(input){
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

    #addToSideBar(){
        const card = misc.elementBuilder(
            "div",
            {"class": "graph-controls", }
        );
        const delete_button = document.createElement("button");
        delete_button.innerText = "Удалить";
        delete_button.onclick = () => {
            this.del();
        }
 

        const mesh_checkbox = misc.elementBuilder(
            "input",
            {"type": "checkbox", "checked" : "true"}
        );
        const mesh_label = document.createElement("label");
        mesh_label.appendChild(mesh_checkbox);
        mesh_label.addEventListener('change', (el) => {
            if(el.target.checked){
                this.showMesh();
                this.#mesh_checkbox = true;
            }else{
                this.hideMesh();
                this.#mesh_checkbox = false;
            }
        });
        mesh_label.innerHTML += "Показать граф";
        this.#mesh_checkbox = true;


        const cloud_checkbox = misc.elementBuilder(
            "input",
            {"type": "checkbox"}
        );
        const cloud_label = document.createElement("label");
        cloud_label.appendChild(cloud_checkbox);
        cloud_label.addEventListener('change', (el) => {
            if(el.target.checked){
                if(this.#mesh_checkbox) this.showCloud();
                this.#cloud_checkbox = true;
            }else{
                if(this.#mesh_checkbox) this.hideCloud();
                this.#cloud_checkbox = false;
            }
        });
        cloud_label.innerHTML += "Показать точки";
        this.#cloud_checkbox = false;

        const colorpicker = misc.elementBuilder(
            "input",
            {"type": "color"},
        )
        colorpicker.value = "#FFFFFF";
        colorpicker.addEventListener("change", (el) => {
            this.#mesh.material = new th.MeshPhysicalMaterial({
                color: el.currentTarget.value,
                side: th.DoubleSide,
            });
            this.#cloud.material = new th.PointsMaterial({
                color: el.currentTarget.value,
                size: 5,
                sizeAttenuation: false,
            });
        });


        const container = misc.elementBuilder(
            "div",
            {"class": "vertical"}
        );
        container.appendChild(mesh_label);
        container.appendChild(cloud_label);


        card.appendChild(delete_button);
        card.appendChild(container);
        card.appendChild(colorpicker);

        this.#card = card;
        document.querySelector("#sidebar").appendChild(this.#card);
    }

    constructor(scene){
        this.#scene = scene;

        //Formula parsing logic
        var formula_raw = document.querySelector("#formula").value.trim().toLowerCase();
        var formula = this.#parseFormula(formula_raw);
        if(formula == null || formula == ""){
            this.#mesh = null;
            this.#cloud = null;
            this.#geometry = null;
        }
        
        const bounds = misc.parseBounds();
        const points = [];
        const points_raw = [];
        const indices = [];
        var ROW = (bounds.upper+1) - bounds.lower;
        var TOTAL = ROW*ROW;
        var x = 0, y = 0, z = 0;

        
        //Display the card
        this.#addToSideBar();
        const p = document.createElement("p");
        p.innerHTML = document.querySelector("#formula").value.toLowerCase();
        this.#card.appendChild(p);

        //Calculates point coordinates depending on the given function
        for(var y = bounds.lower; y <= bounds.upper; y++){
            for(var x = bounds.lower; x <= bounds.upper; x++){
                z = eval(formula);
                if(z > bounds.upper ){
                    points.push([x,y, bounds.upper]);
                    points_raw.push(x,y, bounds.upper);
                    continue;
                } 
                if(z < bounds.lower){
                    points.push([x,y, bounds.lower]);
                    points_raw.push(x,y, bounds.lower);
                    continue;
                }
                if(z != NaN){
                    points.push([x,y,z]);
                    points_raw.push(x,y,z);
                }
            }
        }

        //Builds triangle indices order from cloud of points
        for(var y = 0; y < (TOTAL/(ROW))-1; y++){
            for(var x = 0; x < ROW-1; x++){
                //Indicies
                var cur = x + (y*ROW);
                var clm = cur + 1;
                var row = x + ((y+1)*ROW);
                
                const isOverBounds = (ind) =>{
                    return Math.abs(points[ind][2]) == bounds.upper;
                }
                
                //Triangle check
                if((isOverBounds(cur) + isOverBounds(clm) + isOverBounds(row)) < 3){
                    indices.push(cur, clm, row);
                }

                //Recalculate for 2nd triangle
                cur = (x + 1) + ((y+1)*ROW);
                clm = cur - 1;
                row = (x + 1) + (y*ROW);

                //Triangle check
                if((isOverBounds(cur) + isOverBounds(clm) + isOverBounds(row)) < 3){
                    indices.push(cur, clm, row);
                }
            }
        }     
        const vertices = new Float32Array(points_raw);
    
        //Geometry creation from vertices
        this.#geometry = new th.BufferGeometry();
        this.#geometry.setAttribute('position', new th.BufferAttribute(vertices, 3));
        this.#geometry.setIndex(indices);
        this.#geometry.computeVertexNormals();
    
        // Create mesh and clouds
        this.#mesh = new th.Mesh(
            this.#geometry, 
            new th.MeshPhysicalMaterial({
                color: "#FFFFFF",
                side: th.DoubleSide,
            })
        );
        this.#cloud = new th.Points(
            this.#geometry,
            new th.PointsMaterial({
                color: "#FFFFFF",
                size: 5,
                sizeAttenuation: false,
            }) 
        );
        this.showMesh();
    }

    showMesh(){
        this.#scene.add(this.#mesh);
        if(this.#cloud_checkbox) this.showCloud();
    }
    hideMesh(){
        this.#scene.remove(this.#mesh);
        if(this.#cloud_checkbox) this.hideCloud();
    }
    showCloud(){
        this.#scene.add(this.#cloud);
    }
    hideCloud(){
        this.#scene.remove(this.#cloud)
    }
    del(){
        this.#mesh.geometry.dispose();
        this.#scene.remove(this.#mesh);
        
        this.#cloud.geometry.dispose();
        this.#scene.remove(this.#cloud);

        this.#card.remove();
    }
}