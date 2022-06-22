import process from './ObjectParser.js';
import { load_img } from './ImageLoader.js';
import { Vec3, Vec4, Mat4 } from './math/Linear.js';
import { Draw } from './Draw.js';
import { Shader, VertexData } from './Shader.js';
let canvas = document.querySelector("#view");
canvas.width = 1200;
canvas.height = 1200;
let paper = new Draw(canvas);
let red = {
    r: 255,
    g: 0,
    b: 0,
    a: 255
};
let blue = {
    r: 0,
    g: 0,
    b: 255,
    a: 255
};
let green = {
    r: 0,
    g: 255,
    b: 0,
    a: 255
};
let black = {
    r: 0,
    g: 0,
    b: 0,
    a: 255
};
let model = await process('../res/head.js');
let faces;
faces = model.faces;
let texture_img = await load_img('../res/head.png');
let center = new Vec3(10, 10, 10);
let target = new Vec3(0, 0, 0);
let up = new Vec3(0, 1, 0);
let camera = Mat4.lookat(center, target, up);
let light_dir = new Vec3(1, 1, 1);
light_dir.normalize();
let perspective = new Mat4();
perspective.data[3][2] = -1 / (center.sub(target).norm());
let screen = Mat4.viewport(0, 0, canvas.width, canvas.height);
let combined = screen.mul(perspective.mul(camera));
class GouraudShader extends Shader {
    intensity;
    constructor() {
        super();
        this.intensity = new Vec3(0, 0, 0);
    }
    vertex({ v, n, idx }) {
        // screen coordinate
        let s = Vec4.from_num_arr(v.data.concat(1));
        // internsity element
        let i = light_dir.dot(n);
        s = combined.mul_v4(s).to_p();
        this.intensity.data[idx] = i;
        return Vec3.from_num_arr(s.data);
    }
    fragment(bary) {
        let final_i = this.intensity.dot(bary);
        let r = final_i * 255;
        let g = final_i * 255;
        let b = final_i * 255;
        return { r: r, g: g, b: b, a: 255 };
    }
}
let g_shader = new GouraudShader();
let z_buff = (new Array(canvas.height * canvas.width)).fill(-1000);
function step() {
    paper.clear();
    // z buffer used to perform z-test
    for (let f in faces) {
        let face = faces[f];
        let s_coords = new Array();
        for (let idx = 0; idx <= 2; idx++) {
            let v_data = new VertexData();
            v_data.v = face.get_vertex(idx).data;
            v_data.n = face.get_normal(idx);
            v_data.idx = idx;
            s_coords.push(g_shader.vertex(v_data));
        }
        paper.fill_triangle_shader(s_coords, g_shader, z_buff);
    }
    paper.paint();
}
step();
