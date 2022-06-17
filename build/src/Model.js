import { Vec3 } from './math/Vec.js';
class Face {
    v_idx_arr;
    n_idx_arr;
    t_idx_arr;
    v_arr;
    n_arr;
    t_coord_arr;
    constructor(v1, v2, v3, v_arr, t_coord_arr, t1, t2, t3, n_arr, n1, n2, n3) {
        this.v_idx_arr = new Array();
        this.v_idx_arr.push(v1);
        this.v_idx_arr.push(v2);
        this.v_idx_arr.push(v3);
        this.v_arr = v_arr;
        if (t_coord_arr != null) {
            this.t_coord_arr = t_coord_arr;
            this.t_idx_arr = new Array();
            this.t_idx_arr.push(t1);
            this.t_idx_arr.push(t2);
            this.t_idx_arr.push(t3);
        }
        if (n_arr != null) {
            this.n_arr = n_arr;
            this.n_idx_arr = new Array();
            this.n_idx_arr.push(n1);
            this.n_idx_arr.push(n2);
            this.n_idx_arr.push(n3);
        }
    }
    get_vertex(idx) {
        return this.v_arr[this.v_idx_arr[idx]];
    }
    get_t_coord(idx) {
        if (idx < 0 || idx >= this.t_coord_arr.length) {
            throw new Error("Invalid Index");
        }
        if (this.t_coord_arr.length == 0) {
            throw new Error("No Texture coordinate to be retrived");
        }
        return this.t_coord_arr[this.t_idx_arr[idx]];
    }
    get_normal(idx) {
        if (idx < 0 || idx >= this.n_arr.length) {
            throw new Error("Invalid Index");
        }
        if (this.n_arr.length == 0) {
            throw new Error("No Normal to be retrived");
        }
        return this.n_arr[this.n_idx_arr[idx]];
    }
}
class Vertex {
    data;
    constructor(x, y, z) {
        this.data = new Vec3(x, y, z);
    }
}
export { Face, Vertex };
