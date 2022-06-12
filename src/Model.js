import { Vec3 } from './math/Vec.js';
class Face {
    v_idx_arr;
    constructor(v1, v2, v3) {
        this.v_idx_arr = new Array();
        this.v_idx_arr.push(v1);
        this.v_idx_arr.push(v2);
        this.v_idx_arr.push(v3);
    }
}
class Vertex {
    data;
    constructor(x, y, z) {
        this.data = new Vec3(x, y, z);
    }
}
export { Face, Vertex };
