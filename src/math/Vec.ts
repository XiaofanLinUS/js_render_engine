import { idText } from "../../node_modules/typescript/lib/typescript";
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

    cross(v2: Vec2) {
        let n: number[] = new Array(2);
        return n;
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

export {Vec2, Vec3};