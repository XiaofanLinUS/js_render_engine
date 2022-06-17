import { Vec3 } from './math/Vec.js';
class Face {
    v_idx_arr;
    t_idx_arr;
    v_arr;
    t_coord_arr;
    constructor(v1, v2, v3, v_arr, t_coord_arr, t1, t2, t3) {
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
    }
    get_vertex(idx) {
        return this.v_arr[this.v_idx_arr[idx]];
    }
    get_t_coord(idx) {
        if (this.t_coord_arr.length == 0) {
            return null;
        }
        return this.t_coord_arr[this.t_idx_arr[idx]];
    }
}
class Vertex {
    data;
    constructor(x, y, z) {
        this.data = new Vec3(x, y, z);
    }
}
export { Face, Vertex };
