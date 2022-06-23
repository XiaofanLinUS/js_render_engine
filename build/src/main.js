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
let normal_img = await load_img('../res/head_nm.png');
let center = new Vec3(1, 1, 1.5);
let target = new Vec3(0, 0, 0);
let up = new Vec3(0, 1, 0);
let camera = Mat4.lookat(center, target, up);
let light_dir = new Vec3(1, 1, 1);
light_dir.normalize();
let perspective = new Mat4();
perspective.data[3][2] = -1 / 2;
let screen = Mat4.viewport(0, 0, canvas.width, canvas.height);
let combined = screen.mul(perspective.mul(camera));
function sample_img(img, t_coord) {
    let t_x = Math.floor(t_coord.x() * img.w) - 1;
    let t_y = img.h - (Math.floor(t_coord.y() * img.h) - 1) - 1;
    let t_idx = 4 * (t_x + t_y * img.w);
    let color = {
        r: img.data[t_idx],
        g: img.data[t_idx + 1],
        b: img.data[t_idx + 2],
        a: 255
    };
    return color;
}
class GouraudShader extends Shader {
    intensity;
    t_coord;
    constructor() {
        super();
        this.intensity = new Array(3).fill(0);
        this.t_coord = new Array(3);
    }
    vertex({ v, n, t, idx }) {
        // screen coordinate
        let s = Vec4.from_num_arr(v.data.concat(1));
        // internsity element
        let i = light_dir.dot(n);
        s = combined.mul_v4(s).to_p();
        this.intensity[idx] = i;
        this.t_coord[idx] = t;
        return Vec3.from_num_arr(s.data);
    }
    fragment(bary) {
        let final_intensity = this.intensity[0] * bary.x() + this.intensity[1] * bary.y() + this.intensity[2] * bary.z();
        let final_t_coord = this.t_coord[0].mul(bary.x()).add(this.t_coord[1].mul(bary.y())).add(this.t_coord[2].mul(bary.z()));
        let color = sample_img(texture_img, final_t_coord);
        if (final_intensity > .85)
            final_intensity = 1;
        else if (final_intensity > .60)
            final_intensity = .80;
        else if (final_intensity > .45)
            final_intensity = .60;
        else if (final_intensity > .30)
            final_intensity = .45;
        else if (final_intensity > .15)
            final_intensity = .30;
        else
            final_intensity = 0;
        let r = final_intensity * color.r;
        let g = final_intensity * color.g;
        let b = final_intensity * color.b;
        return { r: r, g: g, b: b, a: 255 };
    }
}
let g_shader = new GouraudShader();
let z_buff = (new Array(canvas.height * canvas.width)).fill(-Infinity);
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
            v_data.t = face.get_t_coord(idx);
            v_data.idx = idx;
            s_coords.push(g_shader.vertex(v_data));
        }
        paper.fill_triangle_shader(s_coords, g_shader, z_buff);
    }
    paper.paint();
}
step();
