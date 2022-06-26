import process from './ObjectParser'
import { load_img, Img } from './ImageLoader';
import { Vec2, Vec3, Vec4, Mat4 } from './math/Linear'
import { Face } from './Model';
import { Draw, Color } from './Draw';
import { Shader, VertexData } from './Shader';  
import { mat4, vec3, vec4 } from 'gl-matrix';


import head_obj_url from './res/head.obj'
import head_url from './res/head.png'
import head_nm_url from './res/head_nm.png'

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



let model = await process(head_obj_url);

let faces: Face[];
faces = model.faces;


let texture_img: Img = await load_img(head_url);
let normal_img: Img = await load_img(head_nm_url);

let center = new Vec3(1, 1, 3);
let target  = new Vec3(0, 0, 0);
let up = new Vec3(0, 1, 0);
let camera = Mat4.lookat(center, target, up);

let light_dir = new Vec3(0, 0, 1);
light_dir = light_dir.normalize();

let perspective = new Mat4();
perspective.data[3][2] = - 1 / 1;

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
    private p_coord: Vec3[]
    private normal_: Vec3[]

    public M: Mat4
    public M_IT: Mat4

    constructor() {
        super();
        this.intensity = new Array(3).fill(0);
        this.t_coord = new Array(3);
        this.p_coord = new Array(3);
        this.normal_ = new Array(3);
    }    

    override vertex({v, n, t, idx}: VertexData): Vec3 {
        // screen coordinate
        let s = Vec4.from_num_arr(v.data.concat(1));
        // internsity element
        let i = light_dir.dot(n);

        s = combined.mul_v4(s).to_p();

        this.normal_[idx] = n;
        this.p_coord[idx] = v;
        this.intensity[idx] = i;
        this.t_coord[idx] = t;

        return Vec3.from_num_arr(s.data);
    }


    override fragment(bary: Vec3) {        
        //let final_intensity = this.intensity[0] * bary.x() + this.intensity[1] * bary.y() + this.intensity[2] * bary.z();
        let final_t_coord   = this.t_coord[0].mul(bary.x()).add(this.t_coord[1].mul(bary.y())).add(this.t_coord[2].mul(bary.z()));
        //let final_p_coord   = this.p_coord[0].mul(bary.x()).add(this.p_coord[1].mul(bary.y())).add(this.p_coord[2].mul(bary.z()));
        let normal = this.normal_[0].mul(bary.x()).add(this.normal_[1].mul(bary.y())).add(this.normal_[2].mul(bary.z()));
        let color = sample_img(texture_img, final_t_coord);
        let normal_color = sample_img(normal_img, final_t_coord);

        normal = new Vec3(normal_color.r, normal_color.g, normal_color.b);
        normal = normal.mul(2/255).sub(new Vec3(1,1,1));
        normal = normal.normalize();
        
        let eye_dir = center.sub(new Vec3(0, 0, 0)).normalize();
        let reflect = normal.mul(2*normal.dot(light_dir)).sub(light_dir).normalize();

        /*
        let normal_ = vec4.fromValues(normal.x(), normal.y(), normal.z(), 0);
        normal_ = vec4.transformMat4(vec4.create(), normal_, this.M_IT);
        let light_dir_ = vec4.fromValues(light_dir.x(), light_dir.y(), light_dir.z(), 0);
        light_dir_ = vec4.transformMat4(vec4.create(), light_dir_, this.M);

        let normal__ = vec3.fromValues(normal_[0], normal_[1], normal_[2]);
        let light_dir__ = vec3.fromValues(light_dir_[0], light_dir_[1], light_dir_[2]);
       


        vec3.normalize(normal__, normal__);
        vec3.normalize(light_dir__, light_dir__);
        */

        
        
        let _light_dir = Vec3.v4(this.M.mul_v3(light_dir, 0)).normalize();
        let _normal = Vec3.v4(this.M_IT.mul_v3(normal, 0)).normalize();

        // reflect = _normal.mul(2*_normal.dot(_light_dir)).sub(_light_dir).normalize();
        // eye_dir = Vec3.v4(this.M.mul_v3(eye_dir, 0)).normalize()
        
        //normal = Vec3.v4(this.M_IT.mul_v3(normal, 0));
        //light_dir = Vec3.v4(this.M.mul_v3(light_dir, 0));

        

        

       

        let spec = 1 * Math.max(0, Math.pow(Math.max(reflect.dot(eye_dir), 0), 55));
        let diff = Math.max(0,normal.dot(light_dir));
        let ambi  = 5;

        
        //console.log(normal.data);
        let r = Math.min(ambi + color.r * (spec + diff), 255);
        let g = Math.min(ambi + color.g * (spec + diff), 255);
        let b = Math.min(ambi + color.b * (spec + diff), 255);

        return {r:r, g:g, b:b, a:255};
    }
}


let g_shader = new GouraudShader();
//g_shader.M = perspective.mul(camera); 
//g_shader.M_IT = Mat4.t(Mat4.inv(perspective.mul(camera)));
let z_buff = (new Array(canvas.height * canvas.width)).fill(-Infinity);


/*
let cam = mat4.create();
mat4.lookAt(cam, vec3.fromValues(center.x(),center.y(),center.z()), vec3.fromValues(target.x(), target.y(), target.z()), vec3.fromValues(0, 1, 0));
let per = mat4.create();
per[3 + 2 * 4] = - 1;
g_shader.M = mat4.create();
mat4.mul(g_shader.M, per, cam);

g_shader.M_IT = mat4.create();
mat4.invert(g_shader.M_IT, g_shader.M);
mat4.transpose(g_shader.M_IT, g_shader.M_IT);


console.log(`g_shader.MIT ${mat4.str(g_shader.M_IT)}`);
console.log(`MIT ${Mat4.inv(perspective.mul(camera)).data}`);



console.log(`g_shader.M ${mat4.str(g_shader.M)}`);
console.log(`M ${Mat4.t(perspective.mul(camera)).data}`);

console.log(`cam ${cam}`);
console.log(`camera ${Mat4.t(camera).data}`);


console.log(`per ${per}`);
console.log(`per_${Mat4.t(perspective).data}`);
*/

g_shader.M = perspective.mul(camera); 
g_shader.M_IT = Mat4.t(Mat4.inv(perspective.mul(camera)));



let u = new Vec4(1, 1, 1, 0);
let v = new Vec4(0, 1, 0, 0);
let u_ = g_shader.M.mul_v4(u);
let v_ = g_shader.M_IT.mul_v4(v);

u.normalize();
v.normalize();

u_.normalize();
v_.normalize();

console.log(u.dot(v));
console.log(u_.dot(v_));


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
