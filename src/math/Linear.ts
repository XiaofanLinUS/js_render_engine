import { Vertex } from "../Model";

class Vec2 {
    data: number[]
    
    constructor(x: number, y: number) {
        this.data = [x, y];
    }

    x() {
        return this.data[0];
    }
    y() {
        return this.data[1];
    }
    sub(v2: Vec2) {
        let new_data : number[] = this.data.map((val, idx)=> val- v2.data[idx]);

        return new Vec2(new_data[0], new_data[1]);

    }

    add(v2: Vec2) {
        let new_data : number[] = this.data.map((val, idx)=> val + v2.data[idx]);

        return new Vec2(new_data[0], new_data[1]);        
    }

    div(val: number) {
        let new_data = this.data.map((v)=> v / val);

        return new Vec2(new_data[0], new_data[1]);
    }

    mul(val: number) {
        let new_data = this.data.map((v)=> v * val);

        return new Vec2(new_data[0], new_data[1]);
    }

    static from_vec3(v: Vec3): Vec2 {
        return new Vec2(v.x(), v.y());
    }
}

class Vec3 {
    data: number[]
    constructor(x: number, y: number, z: number) {
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

    div(val: number) {
        let new_data = this.data.map((v)=> v / val);

        return new Vec3(new_data[0], new_data[1], new_data[2]);
    }

    cross(v2: Vec3) {
        let n: number[] = new Array(3);


        n[0] = this.data[1] * v2.data[2] - this.data[2] * v2.data[1];
        n[1] = this.data[2] * v2.data[0] - this.data[0] * v2.data[2];
        n[2] = this.data[0] * v2.data[1] - this.data[1] * v2.data[0];

        return new Vec3(n[0], n[1], n[2]);
    }

    sub(v2: Vec3) {
        let new_data = this.data.map((val, idx)=> val - v2.data[idx]);

        return Vec3.from_num_arr(new_data);
    }
    dot(v2: Vec3): number {
        let result = this.data.map((val, idx)=> val * v2.data[idx]).reduce((x, y)=> (x+y));

        //console.log(this.data.map((val, idx)=> val * v2.data[idx]));
        return result;
    }
    norm(): number {
        let result = this.dot(this);

        return Math.sqrt(result);
    }
    normalize(): void {
        let norm = this.norm();

        this.data = this.div(norm).data;
    }    
    static from_vertex = (v: Vertex) => {
        return new Vec3(v.data.data[0], v.data.data[1], v.data.data[2]);
    }

    static from_num_arr = (num_arr: number[]) => {
        return new Vec3(num_arr[0], num_arr[1], num_arr[2]);
    }
}
class Vec4 {
    data: number[]
    constructor(x: number, y: number, z: number, w: number) {
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

    div(val: number) {
        let new_data = this.data.map((v)=> v / val);

        return new Vec4(new_data[0], new_data[1], new_data[2], new_data[3]);
    }

    sub(v2: Vec4) {
        let new_data = this.data.map((val, idx)=> val - v2.data[idx]);

        return Vec4.from_num_arr(new_data);
    }
    dot(v2: Vec4): number {
        let result = this.data.map((val, idx)=> val * v2.data[idx]).reduce((x, y)=> (x+y));

        return result;
    }
    norm(): number {
        let result = this.dot(this);

        return Math.sqrt(result);
    }
    normalize(): void {
        let norm = this.norm();

        this.data = this.div(norm).data;
    }

    to_p(): Vec4{
        let new_data = [...this.data];
        if (new_data[3] == 0) throw new Error("w coord is 0");
        new_data[0] = new_data[0] / new_data[3];
        new_data[1] = new_data[1] / new_data[3];
        new_data[2] = new_data[2] / new_data[3];
        new_data[3] = 1;
        
        return Vec4.from_num_arr(new_data);
    }
    static from_num_arr = (num_arr: number[]) => {
        return new Vec4(num_arr[0], num_arr[1], num_arr[2], num_arr[3]);
    }
}

class Mat4 {
    data: number[][]
    constructor() {
        this.data = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
    }

    static from_num_mat(data: number[][]) {
        let result = new Mat4();
        result.data = data;

        return result;
    }

    mul(m2: Mat4) {
        let a = this.data;
        let b = m2.data;
        let c = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

        for(let i = 0; i <= 3; i++) {
            for(let j = 0; j <= 3; j++) {
                let sum = 0;
                for (let k = 0; k <= 3; k++) {
                    sum += a[i][k] * b[k][j];
                }         
                c[i][j] = sum;
            }
        }
        
        return Mat4.from_num_mat(c);
    }

    mul_v4(v2: Vec4) {
        let a = this.data;
        let b = v2.data;
        let result: Vec4 = new Vec4(0, 0, 0, 0);

        for(let i = 0; i <= 3; i++) {
            for(let j = 0; j <= 3; j++) {
                result.data[i] += a[i][j] * b[j];
            }
        }
        return result;
    }

    static viewport(a: number, b: number, w: number, h: number) {
        let mtx = new Mat4();
        mtx.data[0][3] = a + w / 2;
        mtx.data[1][3] = b + h / 2;
        mtx.data[2][3] = 255 / 2;

        mtx.data[0][0] = w / 2;
        mtx.data[1][1] = h / 2;
        mtx.data[2][2] = 255 / 2;

        return mtx;
    }

    static lookat(eye: Vec3, target: Vec3, up: Vec3) {
        let te = eye.sub(target);
        let i, j, k: Vec3;
        te.normalize();
        k = te;
        i = up.cross(k);
        i.normalize();
        j = k.cross(i);

        let rot = new Mat4();
        let trans = new Mat4();
        for(let id = 0; id <= 2; id++) {
            rot.data[0][id] = i.data[id];
            rot.data[1][id] = j.data[id];
            rot.data[2][id] = k.data[id];

            trans.data[id][3] = -eye.data[id];
        }
        return rot.mul(trans);
    }

}
export {Vec2, Vec3, Vec4, Mat4};