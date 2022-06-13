class Vec2 {
    data;
    constructor(x, y) {
        this.data = [x, y];
    }
    x() {
        return this.data[0];
    }
    y() {
        return this.data[1];
    }
    sub(v2) {
        let new_data = this.data.map((val, idx) => val - v2.data[idx]);
        return new Vec2(new_data[0], new_data[1]);
    }
    add(v2) {
        let new_data = this.data.map((val, idx) => val + v2.data[idx]);
        return new Vec2(new_data[0], new_data[1]);
    }
    div(val) {
        let new_data = this.data.map((v) => v / val);
        return new Vec2(new_data[0], new_data[1]);
    }
    mul(val) {
        let new_data = this.data.map((v) => v * val);
        return new Vec2(new_data[0], new_data[1]);
    }
    cross(v2) {
        let n = new Array(2);
        return n;
    }
    static from_vec3(v) {
        return new Vec2(v.x(), v.y());
    }
}
class Vec3 {
    data;
    constructor(x, y, z) {
        this.data = [x, y, z];
    }
    x() {
        return this.data[0];
    }
    y() {
        return this.data[1];
    }
    z() {
        return this.data[2];
    }
    div(val) {
        let new_data = this.data.map((v) => v / val);
        return new Vec3(new_data[0], new_data[1], new_data[2]);
    }
    cross(v2) {
        let n = new Array(3);
        n[0] = this.data[1] * v2.data[2] - this.data[2] * v2.data[1];
        n[1] = this.data[2] * v2.data[0] - this.data[0] * v2.data[2];
        n[2] = this.data[0] * v2.data[1] - this.data[1] * v2.data[0];
        return new Vec3(n[0], n[1], n[2]);
    }
    sub(v2) {
        let new_data = this.data.map((val, idx) => val - v2.data[idx]);
        return Vec3.from_num_arr(new_data);
    }
    dot(v2) {
        let result = this.data.map((val, idx) => val * v2.data[idx]).reduce((x, y) => (x + y));
        //console.log(this.data.map((val, idx)=> val * v2.data[idx]));
        return result;
    }
    norm() {
        let result = this.dot(this);
        return Math.sqrt(result);
    }
    normalize() {
        let norm = this.norm();
        this.data = this.div(norm).data;
    }
    static from_vertex = (v) => {
        return new Vec3(v.data.data[0], v.data.data[1], v.data.data[2]);
    };
    static from_num_arr = (num_arr) => {
        return new Vec3(num_arr[0], num_arr[1], num_arr[2]);
    };
}
export { Vec2, Vec3 };
