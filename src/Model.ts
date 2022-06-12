import {Vec3} from './math/Vec.js'

class Face {
    v_idx_arr : number[]

    constructor(v1: number, v2: number, v3: number) {
        this.v_idx_arr = new Array();
        this.v_idx_arr.push(v1);
        this.v_idx_arr.push(v2);
        this.v_idx_arr.push(v3);
    }
}


class Vertex {
    data: Vec3

    constructor(x: number, y: number, z: number) {
        this.data = new Vec3(x, y, z);
    }
}

export {Face, Vertex};