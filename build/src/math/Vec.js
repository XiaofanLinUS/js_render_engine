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
class Vec4 {
    data;
    constructor(x, y, z, w) {
        this.data = [x, y, z, w];
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
    w() {
        return this.data[3];
    }
    div(val) {
        let new_data = this.data.map((v) => v / val);
        return new Vec4(new_data[0], new_data[1], new_data[2], new_data[3]);
    }
    sub(v2) {
        let new_data = this.data.map((val, idx) => val - v2.data[idx]);
        return Vec4.from_num_arr(new_data);
    }
    dot(v2) {
        let result = this.data.map((val, idx) => val * v2.data[idx]).reduce((x, y) => (x + y));
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
    to_p() {
        let new_data = [...this.data];
        if (new_data[3] == 0)
            throw new Error("w coord is 0");
        new_data[0] = new_data[0] / new_data[3];
        new_data[1] = new_data[1] / new_data[3];
        new_data[2] = new_data[2] / new_data[3];
        new_data[3] = 1;
        return Vec4.from_num_arr(new_data);
    }
    static from_num_arr = (num_arr) => {
        return new Vec4(num_arr[0], num_arr[1], num_arr[2], num_arr[3]);
    };
}
class Mat4 {
    data;
    constructor() {
        this.data = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    }
    static from_num_mat(data) {
        let result = new Mat4();
        result.data = data;
        return result;
    }
    mul(m2) {
        let a = this.data;
        let b = m2.data;
        let c = new Array(4).fill(new Array(4));
        for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 3; j++) {
                let sum = 0;
                for (let k = 0; k <= 3; k++) {
                    sum += a[i][k] * b[k][j];
                }
                c[i][j] = sum;
            }
        }
        return Mat4.from_num_mat(c);
    }
    mul_v4(v2) {
        let a = this.data;
        let b = v2.data;
        let result = new Vec4(0, 0, 0, 0);
        for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 3; j++) {
                result.data[i] += a[i][j] * b[j];
            }
        }
        return result;
    }
    static viewport(a, b, w, h) {
        let mtx = new Mat4();
        mtx.data[0][3] = a + w / 2;
        mtx.data[1][3] = b + h / 2;
        mtx.data[2][3] = 255 / 2;
        mtx.data[0][0] = w / 2;
        mtx.data[1][1] = h / 2;
        mtx.data[2][2] = 255 / 2;
        return mtx;
    }
}
export { Vec2, Vec3, Vec4, Mat4 };
