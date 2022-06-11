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
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
export { Face, Vertex };
