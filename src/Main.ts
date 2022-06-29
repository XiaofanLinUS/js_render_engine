import process from './ObjectParser'
import { load_img, Img } from './ImageLoader';
import { Vec2, Vec3, Vec4, Mat3, Mat4 } from './math/Linear'
import { Face } from './Model';
import { Draw, Color } from './Draw';
import { Shader, VertexData } from './Shader';  
import { mat3, mat4, vec3, vec4 } from 'gl-matrix';


import head_obj_url from './res/diablo3_pose.obj'
import head_url from './res/diablo3_pose_diffuse.png'
import head_nm_url from './res/diablo3_pose_nm_tangent.png'

let canvas: HTMLCanvasElement = document.querySelector("#view");
canvas.width = 800;
canvas.height = 800

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

let center = new Vec3(0, 0, 2);
let target  = new Vec3(0, 0, 0);
let up = new Vec3(0, 1, 0);
let camera = Mat4.lookat(center, target, up);

    
let light_pos = new Vec3(1, 1, 2);
let d_cam = Mat4.lookat(light_pos, target, up);
let light_dir = light_pos.normalize();

let perspective = new Mat4();
perspective.data[3][2] = - 1 / 1;
let screen = Mat4.viewport(-1/4 * canvas.width, -1/4 * canvas.width, 3/2 * canvas.width, 3/2 * canvas.height);

// w to final img
let combined = screen.mul(perspective.mul(camera));
// w to shadow img
let d_combo = screen.mul(perspective.mul(d_cam));
// final img to shadow img
let to_shadow = d_combo.mul(Mat4.inv(combined));

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


class DepthShader extends Shader {
    p_coord: Vec3[]
    constructor() {
        super();
        this.p_coord = new Array(3);
    }    
    override vertex({v,idx}: VertexData): Vec3 {
        let s = Vec3.proj(d_combo.mul_v3(v, 1).to_p());        
        this.p_coord[idx] = s;

        return s;
    }

    override fragment(b: Vec3) {       
        let final_p_coord = this.p_coord[0].mul(b.x()).add(this.p_coord[1].mul(b.y())).add(this.p_coord[2].mul(b.z()));
        
        final_p_coord = final_p_coord.div(255);

        console.log(255 * final_p_coord.z());
        return {r: 255 * final_p_coord.z(), g: 255 * final_p_coord.z(), b: 255 * final_p_coord.z(), a: 255};
    }
}

class GouraudShader extends Shader {
    private t_coord: Vec2[]
    private p_coord: Vec3[]
    private s_coord: Vec3[]
    private normal_: Vec3[]

    public M: Mat4
    public M_IT: Mat4
    public shadow_frame: Uint8ClampedArray;

    constructor() {
        super();
        this.t_coord = new Array(3);
        this.p_coord = new Array(3);
        this.s_coord = new Array(3);
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
        this.t_coord[idx] = t;
        this.s_coord[idx] = Vec3.proj(s);

        return Vec3.from_num_arr(s.data);
    }

    override fragment(bary: Vec3) {        
        let final_t_coord   = this.t_coord[0].mul(bary.x()).add(this.t_coord[1].mul(bary.y())).add(this.t_coord[2].mul(bary.z()));
        //let final_p_coord   = this.p_coord[0].mul(bary.x()).add(this.p_coord[1].mul(bary.y())).add(this.p_coord[2].mul(bary.z()));
        let final_s_coord = this.s_coord[0].mul(bary.x()).add(this.s_coord[1].mul(bary.y())).add(this.s_coord[2].mul(bary.z()));
        let shadow_coord = Vec3.proj(to_shadow.mul_v3(final_s_coord, 1).to_p());

        let sid = 4 * (Math.floor(shadow_coord.x()) + (canvas.height - Math.floor(shadow_coord.y()) - 1) * canvas.width);

        let shadow = 0.3 + 0.7 * ((shadow_coord.z() + 5 > this.shadow_frame[sid])? 1 : 0);
        let fn = this.normal_[0].mul(bary.x()).add(this.normal_[1].mul(bary.y())).add(this.normal_[2].mul(bary.z())).normalize();
        let t = this.t_coord;

        let p0p1 = this.p_coord[1].sub(this.p_coord[0]);
        let p0p2 = this.p_coord[2].sub(this.p_coord[0]);

        let A = Mat3.from_num_mat([p0p1.data, p0p2.data, fn.data]);
        let A_ = Mat3.inv(A);
        
        let u = new Vec3(t[1].x()-t[0].x(), t[2].x() - t[0].x(), 0);
        
        let i = A_.mul_v3(u).normalize();
        let j = fn.cross(i);

        let normal = this.normal_[0].mul(bary.x()).add(this.normal_[1].mul(bary.y())).add(this.normal_[2].mul(bary.z()));
        let color = sample_img(texture_img, final_t_coord);
        let normal_color = sample_img(normal_img, final_t_coord);

        normal = new Vec3(normal_color.r, normal_color.g, normal_color.b);
        normal = normal.mul(2/255).sub(new Vec3(1,1,1));
        normal = normal.normalize();

                
        let t_normal = i.mul(normal.x()).add(j.mul(normal.y())).add(fn.mul(normal.z()));
        let eye_dir = center.sub(new Vec3(0, 0, 0)).normalize();
        let reflect = t_normal.mul(2*t_normal.dot(light_dir)).sub(light_dir).normalize();
        
        let _light_dir = Vec3.proj(this.M.mul_v3(light_dir, 0)).normalize();
        let _normal = Vec3.proj(this.M_IT.mul_v3(t_normal, 0)).normalize();

        //reflect = _normal.mul(2*_normal.dot(_light_dir)).sub(_light_dir).normalize();
        //eye_dir = Vec3.proj(this.M.mul_v3(eye_dir, 0)).normalize();


        let spec = 1 * Math.max(0, Math.pow(Math.max(reflect.dot(eye_dir), 0), 55));
        let diff = Math.max(0,t_normal.dot(light_dir));
        let ambi  = 5;

        let r = Math.min(ambi + color.r * shadow * (spec + diff), 255);
        let g = Math.min(ambi + color.g * shadow * (spec + diff), 255);
        let b = Math.min(ambi + color.b * shadow * (spec + diff), 255);

        return {r:r, g:g, b:b, a:255};
    }
}

let d_shader = new DepthShader();
let g_shader = new GouraudShader();
g_shader.M = perspective.mul(camera); 
g_shader.M_IT = Mat4.t(Mat4.inv(perspective.mul(camera)));

function step() {
    paper.clear();
    let shadow_frame;
    for (let f in faces) {        
        let face = faces[f];
        let s_coords : Vec3[] = new Array();

        for (let idx = 0; idx <= 2; idx++) {
            let v_data = new VertexData();
            v_data.v = face.get_vertex(idx).data;
            v_data.n = face.get_normal(idx);
            v_data.t = face.get_t_coord(idx);
            v_data.idx = idx;
            s_coords.push(d_shader.vertex(v_data));
        }
        paper.fill_triangle_shader(s_coords, d_shader);
    }
    paper.paint();
    shadow_frame = paper.img_data.data;
    g_shader.shadow_frame = shadow_frame;

    
    
    paper.clear();
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
        paper.
        fill_triangle_shader(s_coords, g_shader);
    }

    paper.paint();
    
}

step();
