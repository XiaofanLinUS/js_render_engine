import {Vec2, Vec3} from './math/Vec.js'

class Face {
    v_idx_arr : number[]
    n_idx_arr : number[]
    t_idx_arr: number[]

    v_arr: Vertex[]
    n_arr: Vec3[]
    t_coord_arr: Vec2[]

    constructor(v1: number, v2: number, v3: number, v_arr: Vertex[], 
        t_coord_arr?: Vec2[], t1?: number, t2?: number, t3?: number,
        n_arr?: Vec3[], n1?: number, n2?:number, n3?: number) {
        this.v_idx_arr = new Array();
        this.v_idx_arr.push(v1);
        this.v_idx_arr.push(v2);
        this.v_idx_arr.push(v3);
        this.v_arr = v_arr;

        if(t_coord_arr != null) {
            this.t_coord_arr = t_coord_arr;
            this.t_idx_arr = new Array();
            this.t_idx_arr.push(t1);
            this.t_idx_arr.push(t2);
            this.t_idx_arr.push(t3);
        }

        if(n_arr != null) {
            this.n_arr = n_arr;
            this.n_idx_arr = new Array();
            this.n_idx_arr.push(n1);
            this.n_idx_arr.push(n2);
            this.n_idx_arr.push(n3);
        }
    }

    get_vertex(idx : number) : Vertex {
        return this.v_arr[this.v_idx_arr[idx]];
    }

    get_t_coord(idx: number) : Vec2 {
        if(idx < 0 || idx >= this.t_coord_arr.length) {
            throw new Error("Invalid Index");
        }
        if(this.t_coord_arr.length == 0) {
            throw new Error("No Texture coordinate to be retrived");
        }
        return this.t_coord_arr[this.t_idx_arr[idx]];
    }

    get_normal(idx: number) : Vec3 {
        if(idx < 0 || idx >= this.n_arr.length) {
            throw new Error("Invalid Index");
        }
        if(this.n_arr.length == 0) {
            throw new Error("No Normal to be retrived");
        }
        return this.n_arr[this.n_idx_arr[idx]];
    }
}


class Vertex {
    data: Vec3

    constructor(x: number, y: number, z: number) {
        this.data = new Vec3(x, y, z);
    }
}

export {Face, Vertex};