import process from './ObjectParser'
import { load_img, Img } from './ImageLoader';
import { Vec2, Vec3, Vec4, Mat4 } from './math/Linear'
import { Face, Vertex } from './Model';
import { Draw, Color } from './Draw';
import { Shader, VertexData } from './Shader';
import {mat4, vec4} from "gl-matrix";

let canvas: HTMLCanvasElement = document.querySelector("#view");
canvas.width = 1200;
canvas.height = 1200

let paper = new Draw(canvas);


let red: Color = {
    r: 255,
    g: 0,
    b: 0,
    a: 255
};

let blue: Color = {
    r: 0,
    g: 0,
    b: 255,
    a: 255
};

let green: Color = {
    r: 0,
    g: 255,
    b: 0,
    a: 255
};

let black: Color = {
    r: 0,
    g: 0,
    b: 0,
    a: 255
};


let model = await process('head');

let faces: Face[];
faces = model.faces;


let texture_img: Img = await load_img('head');
let normal_img: Img = await load_img('head_nm');

let center = new Vec3(0, 0, 1);
let target  = new Vec3(0, 0, 0);
let up = new Vec3(0, 1, 0);
let camera = Mat4.lookat(center, target, up);

let light_dir = new Vec3(1, -1, 1);
light_dir.normalize();

let perspective = new Mat4();
perspective.data[3][2] = - 1 / 2;

let screen = Mat4.viewport(0, 0, canvas.width, canvas.height);
let combined = screen.mul(perspective.mul(camera));



function sample_img(img: Img, t_coord: Vec2): Color {
    let t_x = Math.floor(t_coord.x() * img.w) - 1;
    let t_y = img.h  - (Math.floor(t_coord.y() * img.h) - 1) - 1;
    let t_idx = 4 * (t_x + t_y * img.w);


    let color = {
        r: img.data[t_idx],
        g: img.data[t_idx + 1],
        b: img.data[t_idx + 2],
        a: 255
    }
    return color;
}

class GouraudShader extends Shader {
    private intensity: number[]
    private t_coord: Vec2[]

    public M: Mat4
    public M_IT: Mat4

    constructor() {
        super();
        this.intensity = new Array(3).fill(0);
        this.t_coord = new Array(3);
    }

    override vertex({v, n, t, idx}: VertexData): Vec3 {
        // screen coordinate
        let s = Vec4.from_num_arr(v.data.concat(1));
        // internsity element
        let i = light_dir.dot(n);

        s = combined.mul_v4(s).to_p();



        this.intensity[idx] = i;
        this.t_coord[idx] = t;

        return Vec3.from_num_arr(s.data);
    }


    override fragment(bary: Vec3) {        
        //let final_intensity = this.intensity[0] * bary.x() + this.intensity[1] * bary.y() + this.intensity[2] * bary.z();
        let final_t_coord   = this.t_coord[0].mul(bary.x()).add(this.t_coord[1].mul(bary.y())).add(this.t_coord[2].mul(bary.z()));

        let color = sample_img(texture_img, final_t_coord);


        let normal_color = sample_img(normal_img, final_t_coord);
        let normal = new Vec3(normal_color.r, normal_color.g, normal_color.b);
        //normal  = normal.div(255);
        //console.log(normal.data);
        //console.log(normal.norm());
        //normal.normalize();
        //light_dir.normalize();
        normal.div(255/2).sub(new Vec3(1,1,1))

        normal = this.M_IT.mul_v3(normal);
        light_dir = this.M.mul_v3(light_dir);
        
        
        normal.normalize();
        light_dir.normalize();

        //console.log(light_dir.dot(normal));

        let final_intensity = Math.max(0, light_dir.dot(normal));
        
        //console.log(normal.data);
        let r = final_intensity * color.r;
        let g = final_intensity * color.g;
        let b = final_intensity * 0;

        return {r:r, g:g, b:b, a:255};
    }
}

let g_shader = new GouraudShader();

g_shader.M = perspective.mul(camera);

let M = perspective.mul(camera);

let m_ = mat4.create();
 
let m = mat4.fromValues(
    M.data[0][0], M.data[1][0], M.data[2][0], M.data[3][0],
    M.data[0][1], M.data[1][1], M.data[2][1], M.data[3][1],
    M.data[0][2], M.data[1][2], M.data[2][2], M.data[3][2],
    M.data[0][3], M.data[1][3], M.data[2][3], M.data[3][3]); 
mat4.invert(m_, m);
 
g_shader.M_IT = Mat4.t(Mat4.inv(g_shader.M));

console.log(`m_ ${m_}`);
console.log(`m ${g_shader.M_IT.data}`);

let u = new Vec4(1, 1, 5, 1);
let t = new Vec4(0, 0, 0, 1);
let v = new Vec4(1, 2, 1, 0);
let ut = u.sub(t);

let u_ = g_shader.M.mul_v4(u);
let t_ = g_shader.M.mul_v4(t);
let v_ = g_shader.M_IT.mul_v4(v);

console.log(g_shader.M.mul(g_shader.M_IT).data);

let ut__ = g_shader.M.mul_v4(ut);
let ut_ = u_.sub(t_);


ut.normalize();
v.normalize();

ut_.normalize();
ut__.normalize();
v_.normalize();

console.log(ut.dot(v));
console.log(ut_.dot(v_));

console.log(`ut__ ${ut__.data}`);
console.log(`ut_ ${ut_.data}`);
//console.log(Mat4.inv(Mat4.from_num_mat([[2,5,0,8],[1,4,2,6],[7,8,9,3],[1,5,7,8]])).data);

let z_buff = (new Array(canvas.height * canvas.width)).fill(-Infinity);
function step() {
    paper.clear();        
    // z buffer used to perform z-test
    for (let f in faces) {
        
        let face = faces[f];
        let s_coords : Vec3[] = new Array();

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
