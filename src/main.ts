import process from './ObjectParser.js'
import {Vec2, Vec3} from './math/Vec.js'
import { parseCommandLine } from '../node_modules/typescript/lib/typescript.js';
import { Vertex } from './Model.js';

let canvas : HTMLCanvasElement = document.querySelector("#view");
let ctx = canvas.getContext('2d');
let img_data : ImageData;
let clear_canvas = () => {    
    ctx.fillStyle = 'rgba(200,200,200,255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);    
}

canvas.width = 500;
canvas.height = 500;
clear_canvas();
img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);    
let paint_canvas = () => {
    ctx.putImageData(img_data, 0, 0);
    
}


interface Color {
    r: number,
    g: number,
    b: number,
    a: number    
};

let red : Color = {
    r: 255,
    g: 0,
    b: 0,
    a: 255
};

let blue : Color = {
    r: 0,
    g: 0,
    b: 255,
    a: 255
};

let green : Color = {
    r: 0,
    g: 255,
    b: 0,
    a: 255
};

let black : Color = {
    r: 0,
    g: 0,
    b: 0,
    a: 255
};

let draw_dot = (x: number, y: number, c: Color) => {
    if (x >= canvas.width || x < 0 || y >= canvas.height || y < 0) {
        return;
    }
    x = Math.floor(x);
    y = Math.floor(y);
    y = canvas.height - y - 1;
    let idx = (x + y * canvas.width) * 4;
    //ctx.fillStyle = color;
    //ctx.fillRect(x, y, 1, 1);
    img_data.data[idx]   = c.r;
    img_data.data[idx+1] = c.g;
    img_data.data[idx+2] = c.b;
    img_data.data[idx+3] = c.a;
}

let draw_line1 = (x0: number, y0: number, x1: number, y1:number, color:string) => {
    for(let t = 0; t <= 1; t += 0.01) {
        let x = x0 + (x1 - x0) * t;
        let y = y0 + (y1 - y0) * t;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }
}

let draw_line2 = (x0: number, y0: number, x1: number, y1:number, color: Color) => {
    for(let x = x0; x <= x1; x++) {
        let t = (x - x0) / (x1 - x0);
        let y = y0 + (y1 - y0) * t;
        draw_dot(x, y, color);
    }
    
}

let draw_line3 = (x0: number, y0: number, x1: number, y1: number, color: Color) : void => {
    let transpose = false;
    if(Math.abs(x1 - x0) < Math.abs(y1 - y0)) {
        transpose = true;
        [x0, y0, x1, y1] = [y0, x0, y1, x1];
    }

    if(x1 < x0) {
        [x0, y0, x1, y1] = [x1, y1, x0, y0];
    }
    
    for(let x = x0; x <= x1; x++) {
        let t = (x - x0) / (x1 - x0);
        let y = Math.floor(y0 + (y1 - y0) * t);
        if(transpose) {
            draw_dot(y, x, color);
        }else {
            draw_dot(x, y, color);
        }
    }
}



let draw_line4 = (x0: number, y0: number, x1: number, y1: number, color: Color) : void => {
    let transpose : boolean = false;

    [x0, y0, x1, y1] = [x0, y0, x1, y1].map(Math.floor);
    if(Math.abs(x1 - x0) < Math.abs(y1 - y0)) {
        transpose = true;
        [x0, y0] = [y0, x0];
        [x1, y1] = [y1, x1];
    }

    if(x1 < x0) {
        [x0, x1] = [x1, x0];
        [y0, y1] = [y1, y0];
    }

    let derror = Math.abs((y1 - y0) / (x1 - x0));
    let error  = 0;
    let y = y0;
    for(let x = x0; x <= x1; x++) {

        if(transpose) {
            draw_dot(y, x, color);
        }else {
            draw_dot(x, y, color);
        }
        error += derror;

        if (error > 1) {
            y += (y1 > y0) ? 1 : -1;
            error -= 1;
        }
    }
}

/* console.profile("draw");
for (let i = 0; i < 1000000; i++) {
    //draw_line3(0, 0, 500, 500, "rbg(0,0,0)");
    draw_line4(0, 0, 500, 500, red);
}
console.profileEnd("draw");
 */


clear_canvas();
/* draw_line2(0, 0, 500, 500, "black");
draw_line2(0, 0, 100, 500, "red");
draw_line2(0, 0, 500, 100, "blue");
draw_line2(400, 200, 0, 0, "blue"); */
clear_canvas();
/* 
draw_line4(0, 0, 500, 500, red);
draw_line4(0, 0, 100, 500, green);
draw_line4(0, 0, 500, 100, blue);
draw_line4(400, 200, 0, 0, black);
draw_line4(0, 500, 300, 0, black);
draw_line4(218.443, 220.908, 214.421, 208.30225, black); */
paint_canvas();
//clear_canvas();
/* 
let model = await process('../res/head.js');

let faces, vertices;
if (model) {
    faces = model.faces;
    vertices = model.vertices;
}else {
    throw new Error("what's up");
}
for(let f in faces) {
    let face = faces[f];
    for (let i = 0; i < 3; i++) {
        let p1 = vertices[face.v_idx_arr[i]];
        let p2 = vertices[face.v_idx_arr[(i+1)%3]];

        let x0 = (p1.data[0] + 1) * 0.5 * canvas.width;
        let y0 = (p1.data[1] + 1) * 0.5 * canvas.height;
        let x1 = (p2.data[0] + 1) * 0.5 * canvas.width;
        let y1 = (p2.data[1] + 1) * 0.5 * canvas.height;
        
        draw_line4(x0, y0, x1, y1, black);
    }
}
paint_canvas();
clear_canvas(); */

let draw_line4_v = (p0: Vec2, p1: Vec2, color: Color) => {
    draw_line4(p0.data[0], p0.data[1], p1.data[0], p1.data[1], color);
}

let draw_triangle = (v1: Vec2, v2: Vec2, v3: Vec2, color: Color) => {
    draw_line4_v(v1, v2, color);
    draw_line4_v(v2, v3, color);
    draw_line4_v(v3, v1, color);
}
let v1 = new Vec2(20, 50);
let v2 = new Vec2(400, 100);
let v3 = new Vec2(100, 300);

//draw_triangle(v1, v2, v3, red);

let fill_triangle = (v1: Vec2, v2: Vec2, v3: Vec2, color: Color) => {
    if(v1.data[1] == v2.data[1] && v1.data[1] == v3.data[1]) {
        return;
    }
    let vs = [v1, v2, v3];
    vs.sort((a,b)=> a.data[1] < b.data[1] ? -1 : 1);
    //vs.map(console.log);
    for(let y = vs[0].data[1]; y <= vs[2].data[1]; y++) {
        let x_l : number, x_r : number;
        let x1 = vs[0].data[0];
        let x2 = vs[1].data[0];
        let x3 = vs[2].data[0];
        let y1 = vs[0].data[1];
        let y2 = vs[1].data[1];
        let y3 = vs[2].data[1];
        let delta_y = y - y1;

        x_r = (x3 - x1) / (y3 - y1) * delta_y + x1;
        if (y <= y2 && y1 != y2) {
            // y2 == y3
            x_l = (x2 - x1) / (y2 - y1) * delta_y + x1            
        }else {
            delta_y = y - y2;
            x_l = (x3 - x2) / (y3 - y2) * delta_y + x2;
        }
        //draw_line4(x_l, y, x_r, y, color);
        if (x_l > x_r) {
            [x_l, x_r] = [x_r, x_l];
        }

        for(let x = x_l; x <= x_r; x++) {
            draw_dot(x, y, color);
            draw_dot(x, y, color);
        }
    }
}

paint_canvas();
clear_canvas();

// test case 1:
/* 
fill_triangle(new Vec2(20, 50),
new Vec2(400, 100),
new Vec2(100, 300), black);
 */
// test case 2:
//fill_triangle(new Vec2(20, 50),new Vec2(90, 100),new Vec2(120, 500), red);

// test case 3:
//fill_triangle(new Vec2(50, 60),new Vec2(10, 180),new Vec2(80, 300), blue);

// test case 4:
//fill_triangle(new Vec2(150, 80),new Vec2(30, 120),new Vec2(80, 400), green);

/* // test case 5
fill_triangle(new Vec2(150, 80),
new Vec2(30, 120),
new Vec2(0, 400), black);
 */
/* fill_triangle(new Vec2(150, 0),
new Vec2(30, 0),
new Vec2(0, 400), black);
 */
//fill_triangle(new Vec2(150, 0),new Vec2(30, 400),new Vec2(0, 400), black);

interface Bbox {
    min: Vec2,
    max: Vec2
}
let find_bbox = (p1: Vec2, p2: Vec2, p3: Vec2) : Bbox => {
    let min_x = [p1, p2, p3].reduce((p, c)=> p.data[0] < c.data[0] ? p : c).data[0];
    let min_y = [p1, p2, p3].reduce((p, c)=> p.data[1] < c.data[1] ? p : c).data[1];

    let max_x = [p1, p2, p3].reduce((p, c)=> p.data[0] > c.data[0] ? p : c).data[0];
    let max_y = [p1, p2, p3].reduce((p, c)=> p.data[1] > c.data[1] ? p : c).data[1];

    return {min: new Vec2(min_x, min_y), max: new Vec2(max_x, max_y)};
}

let get_barycentric = (p: Vec2, a: Vec2, b: Vec2, c: Vec2): Vec3 => {
    let ab = b.sub(a);
    let ac = c.sub(a);
    let pa = a.sub(p);

    let v1 = new Vec3(ab.x(), ac.x(), pa.x());
    let v2 = new Vec3(ab.y(), ac.y(), pa.y());

    let n = v1.cross(v2);

    if (Math.abs(n.z()) < 1) {
        return new Vec3(-1, 1, 1);
    }
    
    let b_coord = n;

    b_coord = new Vec3(1 - (b_coord.x() + b_coord.y()) / b_coord.z(), b_coord.x() / b_coord.z(), b_coord.y() / b_coord.z());
    return b_coord;
}

let is_inside = (p: Vec2, a: Vec2, b: Vec2, c: Vec2): boolean => {
    let b_coord = get_barycentric(p, a, b, c);

    let data = b_coord.data;

    let failed = data.some(v=> v < -0.03);

    return !failed;
}

let fill_triangle2 = (p1: Vec2, p2: Vec2, p3: Vec2, color: Color) => {
    let bbox = find_bbox(p1, p2, p3);

    let min_x = bbox.min.x();
    let min_y = bbox.min.y();
    let max_x = bbox.max.x();
    let max_y = bbox.max.y();
    /* 
    draw_line4(min_x, min_y, min_x, max_y, red);
    draw_line4(min_x, max_y, max_x, max_y, red);
    draw_line4(min_x, min_y, max_x, min_y, red);
    draw_line4(max_x, max_y, max_x, min_y, red); */

    for(let x = bbox.min.data[0]; x <= bbox.max.data[0]; x++) {
        for(let y = bbox.min.data[1]; y<= bbox.max.data[1]; y++) {
            let p = new Vec2(x, y);
            if(is_inside(p, p1, p2, p3)) {
                draw_dot(p.x(), p.y(), color);
            }
        }
    }
}

//draw_line4(0, 100, 100 ,200, red);

fill_triangle2(new Vec2(150, 0), new Vec2(30, 400), new Vec2(0, 400), black);

console.log((new Vec2(1, 1)).sub(new Vec2(-1, -1)));
console.log((new Vec3(1, 1, 1).div(2)));
paint_canvas();
clear_canvas();
let model = await process('../res/head.js');

let faces, vertices;
if (model) {
    faces = model.faces;
    vertices = model.vertices;
}else {
    throw new Error("what's up");
}
for(let f in faces) {
    let light_dir = new Vec3(0, 0,-1);
    let face = faces[f];
    let w1, w2, w3: Vec3;
    let intensity: number;
    let w_coord: Vec3;
    let v1 = new Vec2((1+vertices[face.v_idx_arr[0]].data.x())*canvas.width/2, (1+vertices[face.v_idx_arr[0]].data.y())*canvas.height/2);
    let v2 = new Vec2((1+vertices[face.v_idx_arr[1]].data.x())*canvas.width/2, (1+vertices[face.v_idx_arr[1]].data.y())*canvas.height/2);
    let v3 = new Vec2((1+vertices[face.v_idx_arr[2]].data.x())*canvas.width/2, (1+vertices[face.v_idx_arr[2]].data.y())*canvas.height/2);
    
    w1 = Vec3.from_vertex(face.get_vertex(0));
    w2 = Vec3.from_vertex(face.get_vertex(1));
    w3 = Vec3.from_vertex(face.get_vertex(2));
    w_coord = (w3.sub(w1)).cross(w2.sub(w1));
    
    w_coord.normalize();
    
    intensity = w_coord.dot(light_dir);
    
    if(intensity > 0) {
        console.log(intensity);    
        fill_triangle2(v1, v2, v3,
            {
                r: 255 * intensity,
                g: 255 * intensity,
                b: 255 * intensity,
                a: 255
            }
            );
    }
}

console.log((new Vec3(0, 0, 0)).sub(new Vec3(1, 1, 1)).norm());
console.log(Math.sqrt(3));
paint_canvas();
