import process from './ObjectParser.js';
import { load_img } from './ImageLoader.js';
import { Vec3, Vec4, Mat4 } from './math/Linear.js';
import { Draw } from './Draw.js';
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
let t = 0;
function step() {
    paper.clear();
    let light_dir = new Vec3(2 * Math.sin(t), 0, 2 * Math.cos(t));
    let camera = Mat4.lookat(light_dir, new Vec3(0, 0, 0), new Vec3(0, 1, 0));
    let perspective = new Mat4();
    let screen = Mat4.viewport(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);
    let center = 5;
    perspective.data[3][2] = -1 / center;
    let combined = screen.mul(perspective.mul(camera));
    let z_buff = (new Array(canvas.height * canvas.width)).fill(-10000);
    // z buffer used to perform z-test
    for (let f in faces) {
        let face = faces[f];
        let w1, w2, w3;
        let w1_, w2_, w3_;
        let s1, s2, s3;
        let t1, t2, t3;
        // t1, t2, t3 are texture coordinates of vertices of faces[f]
        let i1, i2, i3;
        let n1, n2, n3;
        t1 = face.get_t_coord(0);
        t2 = face.get_t_coord(1);
        t3 = face.get_t_coord(2);
        // w1, w2, w3 is world coordinates of vertices of faces[f]    
        w1 = Vec3.from_vertex(face.get_vertex(0));
        w2 = Vec3.from_vertex(face.get_vertex(1));
        w3 = Vec3.from_vertex(face.get_vertex(2));
        w1_ = Vec4.from_num_arr(w1.data.concat(1));
        w2_ = Vec4.from_num_arr(w2.data.concat(1));
        w3_ = Vec4.from_num_arr(w3.data.concat(1));
        w1_ = combined.mul_v4(w1_).to_p();
        w2_ = combined.mul_v4(w2_).to_p();
        w3_ = combined.mul_v4(w3_).to_p();
        // s1, s2, s3 is screen coordinates of vertices of faces[f]
        s1 = Vec3.from_num_arr(w1_.data);
        s2 = Vec3.from_num_arr(w2_.data);
        s3 = Vec3.from_num_arr(w3_.data);
        n1 = face.get_normal(0);
        n2 = face.get_normal(1);
        n3 = face.get_normal(2);
        light_dir.normalize();
        i1 = n1.dot(light_dir);
        i2 = n2.dot(light_dir);
        i3 = n3.dot(light_dir);
        paper.fill_triangle_texture_(s1, s2, s3, i1, i2, i3, z_buff, texture_img, t1, t2, t3);
    }
    t += 0.1;
    paper.paint();
    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
