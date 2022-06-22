import { Color } from "./Draw.js";
import { Vec2, Vec3 } from "./math/Linear.js";

class VertexData {
    v: Vec3
    n: Vec3
    t: Vec2
    idx: number

    constructor() {
        this.v = null;
        this.n = null;
        this.t = null;
        this.idx = null;
    }

}

abstract class Shader {
    abstract vertex(stuff: VertexData): Vec3 
    abstract fragment(barycentric: Vec3): Color

}


export {Shader, VertexData}