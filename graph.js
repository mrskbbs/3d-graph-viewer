import * as th from 'three';
import * as misc from './misc.js';
export class Graph{
    #geometry;
    #mesh;
    #cloud;
    #scene;
    #card;
    #cloud_checkbox;
    #mesh_checkbox;
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
    }

    constructor(scene){
        this.#scene = scene;
        this.#addToSideBar();
        document.querySelector("#sidebar").appendChild(this.#card);

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
    isMeshVisible(){
        return this.#mesh_checkbox;
    }
    isCloudVisible(){
        return this.#mesh_checkbox && this.#cloud_checkbox;
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