import process from './ObjectParser.js';
import { load_img } from './ImageLoader.js';
import { Vec2, Vec3, Vec4, Mat4 } from './math/Linear.js';
let canvas = document.querySelector("#view");
let ctx = canvas.getContext('2d');
let img_data;
let clear_canvas = () => {
    console.log("clean");
    ctx.fillStyle = 'rgba(0,0,0,255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
canvas.width = 1200;
canvas.height = 1200;
clear_canvas();
img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
let paint_canvas = () => {
    console.log("paint");
    ctx.putImageData(img_data, 0, 0);
};
;
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
let draw_dot = (x, y, c) => {
    if (x >= canvas.width || x < 0 || y >= canvas.height || y < 0) {
        return;
    }
    x = Math.floor(x);
    y = Math.floor(y);
    y = canvas.height - y - 1;
    let idx = (x + y * canvas.width) * 4;
    //ctx.fillStyle = color;
    //ctx.fillRect(x, y, 1, 1);
    img_data.data[idx] = c.r;
    img_data.data[idx + 1] = c.g;
    img_data.data[idx + 2] = c.b;
    img_data.data[idx + 3] = c.a;
};
let draw_line1 = (x0, y0, x1, y1, color) => {
    for (let t = 0; t <= 1; t += 0.01) {
        let x = x0 + (x1 - x0) * t;
        let y = y0 + (y1 - y0) * t;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }
};
let draw_line2 = (x0, y0, x1, y1, color) => {
    for (let x = x0; x <= x1; x++) {
        let t = (x - x0) / (x1 - x0);
        let y = y0 + (y1 - y0) * t;
        draw_dot(x, y, color);
    }
};
let draw_line3 = (x0, y0, x1, y1, color) => {
    let transpose = false;
    if (Math.abs(x1 - x0) < Math.abs(y1 - y0)) {
        transpose = true;
        [x0, y0, x1, y1] = [y0, x0, y1, x1];
    }
    if (x1 < x0) {
        [x0, y0, x1, y1] = [x1, y1, x0, y0];
    }
    for (let x = x0; x <= x1; x++) {
        let t = (x - x0) / (x1 - x0);
        let y = Math.floor(y0 + (y1 - y0) * t);
        if (transpose) {
            draw_dot(y, x, color);
        }
        else {
            draw_dot(x, y, color);
        }
    }
};
let draw_line4 = (x0, y0, x1, y1, color) => {
    let transpose = false;
    [x0, y0, x1, y1] = [x0, y0, x1, y1].map(Math.floor);
    if (Math.abs(x1 - x0) < Math.abs(y1 - y0)) {
        transpose = true;
        [x0, y0] = [y0, x0];
        [x1, y1] = [y1, x1];
    }
    if (x1 < x0) {
        [x0, x1] = [x1, x0];
        [y0, y1] = [y1, y0];
    }
    let derror = Math.abs((y1 - y0) / (x1 - x0));
    let error = 0;
    let y = y0;
    for (let x = x0; x <= x1; x++) {
        if (transpose) {
            draw_dot(y, x, color);
        }
        else {
            draw_dot(x, y, color);
        }
        error += derror;
        if (error > 1) {
            y += (y1 > y0) ? 1 : -1;
            error -= 1;
        }
    }
};
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
let draw_line4_v = (p0, p1, color) => {
    draw_line4(p0.data[0], p0.data[1], p1.data[0], p1.data[1], color);
};
let draw_triangle = (v1, v2, v3, color) => {
    draw_line4_v(v1, v2, color);
    draw_line4_v(v2, v3, color);
    draw_line4_v(v3, v1, color);
};
let v1 = new Vec2(20, 50);
let v2 = new Vec2(400, 100);
let v3 = new Vec2(100, 300);
//draw_triangle(v1, v2, v3, red);
let fill_triangle = (v1, v2, v3, color) => {
    if (v1.data[1] == v2.data[1] && v1.data[1] == v3.data[1]) {
        return;
    }
    let vc = v1.add(v2.add(v3)).div(3);
    v1 = vc.add(v1.sub(vc).mul(1.01));
    v2 = vc.add(v2.sub(vc).mul(1.01));
    v3 = vc.add(v3.sub(vc).mul(1.01));
    let vs = [v1, v2, v3];
    vs.sort((a, b) => a.data[1] < b.data[1] ? -1 : 1);
    //vs.map(console.log);
    for (let y = vs[0].data[1]; y <= vs[2].data[1]; y++) {
        let x_l, x_r;
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
            x_l = (x2 - x1) / (y2 - y1) * delta_y + x1;
        }
        else {
            delta_y = y - y2;
            x_l = (x3 - x2) / (y3 - y2) * delta_y + x2;
        }
        //draw_line4(x_l, y, x_r, y, color);
        if (x_l > x_r) {
            [x_l, x_r] = [x_r, x_l];
        }
        for (let x = x_l; x <= x_r; x++) {
            draw_dot(x, y, color);
            draw_dot(x, y, color);
        }
    }
};
paint_canvas();
clear_canvas();
let find_bbox = (p1, p2, p3) => {
    let min_x = [p1, p2, p3].reduce((p, c) => p.data[0] < c.data[0] ? p : c).data[0];
    let min_y = [p1, p2, p3].reduce((p, c) => p.data[1] < c.data[1] ? p : c).data[1];
    let max_x = [p1, p2, p3].reduce((p, c) => p.data[0] > c.data[0] ? p : c).data[0];
    let max_y = [p1, p2, p3].reduce((p, c) => p.data[1] > c.data[1] ? p : c).data[1];
    return { min: new Vec2(min_x, min_y), max: new Vec2(max_x, max_y) };
};
let get_barycentric = (p, a, b, c) => {
    let ab = b.sub(a);
    let ac = c.sub(a);
    let pa = a.sub(p);
    let v1 = new Vec3(ab.x(), ac.x(), pa.x());
    let v2 = new Vec3(ab.y(), ac.y(), pa.y());
    let n = v1.cross(v2);
    // degenerated triangle
    if (Math.abs(n.z()) < 1) {
        return new Vec3(-1, 1, 1);
    }
    let b_coord = n.div(n.z());
    b_coord = new Vec3(1.0 - (b_coord.x() + b_coord.y()), b_coord.x(), b_coord.y());
    return b_coord;
};
let get_barycentric_v3 = (p, a, b, c) => {
    let ab = b.sub(a);
    let ac = c.sub(a);
    let pa = a.sub(p);
    let s1 = new Vec3(ab.x(), ac.x(), pa.x());
    let s2 = new Vec3(ab.y(), ac.y(), pa.y());
    let u = s1.cross(s2);
    //console.log(u.data);
    if (Math.abs(u.z()) < 1e-2) {
        return new Vec3(-1, 1, 1);
    }
    let b_coord = new Vec3(1.0 - (u.x() + u.y()) / u.z(), u.x() / u.z(), u.y() / u.z());
    return b_coord;
};
let is_inside = (p, a, b, c) => {
    let b_coord = get_barycentric(p, a, b, c);
    let data = b_coord.data;
    let failed = data.some(v => v < -0.05);
    return !failed;
};
let fill_triangle2 = (p1, p2, p3, color) => {
    let bbox = find_bbox(p1, p2, p3);
    let min_x = bbox.min.x();
    let min_y = bbox.min.y();
    let max_x = bbox.max.x();
    let max_y = bbox.max.y();
    /* let pc = p1.add(p2.add(p3)).div(3);
    
    p1 = pc.add(p1.sub(pc).mul(1.3));
    p2 = pc.add(p2.sub(pc).mul(1.3));
    p3 = pc.add(p3.sub(pc).mul(1.3)); */
    /*
    draw_line4(min_x, min_y, min_x, max_y, red);
    draw_line4(min_x, max_y, max_x, max_y, red);
    draw_line4(min_x, min_y, max_x, min_y, red);
    draw_line4(max_x, max_y, max_x, min_y, red); */
    for (let x = bbox.min.data[0]; x <= bbox.max.data[0]; x++) {
        for (let y = bbox.min.data[1]; y <= bbox.max.data[1]; y++) {
            let p = new Vec2(x, y);
            if (is_inside(p, p1, p2, p3)) {
                draw_dot(p.x(), p.y(), color);
            }
        }
    }
};
//draw_line4(0, 100, 100 ,200, red);
fill_triangle2(new Vec2(150, 0), new Vec2(30, 400), new Vec2(0, 400), black);
console.log((new Vec2(1, 1)).sub(new Vec2(-1, -1)));
console.log((new Vec3(1, 1, 1).div(2)));
paint_canvas();
clear_canvas();
let model = await process('../res/head.js');
let faces;
if (model) {
    faces = model.faces;
}
else {
    throw new Error("what's up");
}
/*
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
        let color =  {
            r: 255 * intensity,
            g: 255 * intensity,
            b: 255 * intensity,
            a: 255
        };
        fill_triangle2(v1, v2, v3, color);
        draw_triangle(v1, v2, v3, color);
    }
} */
clear_canvas();
let fill_triangle_vec3 = (p1, p2, p3, color, z_buff) => {
    let bbox = find_bbox(Vec2.from_vec3(p1), Vec2.from_vec3(p2), Vec2.from_vec3(p3));
    let bb_min = bbox.min;
    let bb_max = bbox.max;
    for (let x = Math.floor(bb_min.x()); x <= Math.floor(bb_max.x()); x++) {
        for (let y = Math.floor(bb_min.y()); y <= Math.floor(bb_max.y()); y++) {
            let p = new Vec3(x, y, 0);
            let bary = get_barycentric_v3(p, p1, p2, p3);
            let outside = bary.data.some(v => v < 0);
            let z = p1.z() * bary.x() + p2.z() * bary.y() + p3.z() * bary.z();
            //console.log(z);
            if (outside)
                continue;
            if (Math.floor(x) == 311 && Math.floor(y) == (499 - 440)) {
                console.log("Hit");
            }
            let idx = Math.floor(x) + Math.floor(y) * canvas.width;
            //console.log(`${idx}, ${Math.floor(x + y * canvas.width)}`);
            //console.log(idx == (311 + (499 - 440) * canvas.width));
            if (idx == (311 + (499 - 440) * canvas.width)) {
                console.log(z);
            }
            if (z > z_buff[idx]) {
                z_buff[idx] = z;
                //console.log(idx);
                draw_dot(x, y, color);
            }
        }
    }
};
console.profile("Model");
let z_buff = (new Array(canvas.height * canvas.width)).fill(-10000);
// z buffer used to perform z-test
fill_triangle_vec3(new Vec3(0, 250, -2), new Vec3(100, 499, 1), new Vec3(100, 0, 1), red, z_buff);
fill_triangle_vec3(new Vec3(20, 499, 3), new Vec3(20, 0, 3), new Vec3(150, 250, -3), blue, z_buff);
/* for(let f in faces) {
    

    let light_dir = new Vec3(0, 0,-1);
    let face = faces[f];
    let w1, w2, w3: Vec3;
    let s1, s2, s3: Vec3;

    let intensity: number;
    let normal: Vec3;

    
    // w1, w2, w3 is world coordinates of vertices of faces[f]
    w1 = Vec3.from_vertex(face.get_vertex(0));
    w2 = Vec3.from_vertex(face.get_vertex(1));
    w3 = Vec3.from_vertex(face.get_vertex(2));
    // s1, s2, s3 is screen coordinates of vertices of faces[f]
    s1 = new Vec3((1+w1.x())*canvas.width/2, (1+w1.y())*canvas.height/2, w1.z());
    s2 = new Vec3((1+w2.x())*canvas.width/2, (1+w2.y())*canvas.height/2, w2.z());
    s3 = new Vec3((1+w3.x())*canvas.width/2, (1+w3.y())*canvas.height/2, w3.z());
    
    
    normal = (w3.sub(w1)).cross(w2.sub(w1));
    normal.normalize();
    
    intensity = normal.dot(light_dir);
    
    
    if(intensity > 0) {
        let color =  {
            r: 255 * intensity,
            g: 255 * intensity,
            b: 255 * intensity,
            a: 255
        };
        fill_triangle_vec3(s1, s2, s3, color, z_buff);
    }
} */
console.log(z_buff[311 + (499 - 440) * canvas.width]);
console.profileEnd("Model");
paint_canvas();
let texture_img = await load_img('../res/head.png');
let fill_triangle_texture = (p1, p2, p3, intensity, z_buff, texture_img, t1, t2, t3) => {
    let bbox = find_bbox(Vec2.from_vec3(p1), Vec2.from_vec3(p2), Vec2.from_vec3(p3));
    let bb_min = bbox.min;
    let bb_max = bbox.max;
    for (let x = Math.floor(bb_min.x()); x <= Math.floor(bb_max.x()); x++) {
        for (let y = Math.floor(bb_min.y()); y <= Math.floor(bb_max.y()); y++) {
            let p = new Vec3(x, y, 0);
            let bary = get_barycentric_v3(p, p1, p2, p3);
            let outside = bary.data.some(v => v < 0);
            if (outside)
                continue;
            let z = p1.z() * bary.x() + p2.z() * bary.y() + p3.z() * bary.z();
            let t = t1.mul(bary.x()).add(t2.mul(bary.y())).add(t3.mul(bary.z()));
            let t_x = Math.floor(t.x() * texture_img.w);
            let t_y = texture_img.h - Math.floor(t.y() * texture_img.h) - 1;
            //console.log(`${t_x}, ${t_y}`);
            let t_idx = 4 * (t_x + t_y * texture_img.w);
            let color = {
                r: 255 * intensity,
                g: 255 * intensity,
                b: 255 * intensity,
                a: texture_img.data[t_idx + 3]
            };
            /*
                    |_
                   (0, 0)
            */
            let idx = Math.floor(x) + Math.floor(y) * canvas.width;
            if (z > z_buff[idx]) {
                z_buff[idx] = z;
                //console.log(idx);
                draw_dot(x, y, color);
            }
        }
    }
};
let fill_triangle_texture_ = (p1, p2, p3, i1, i2, i3, z_buff, texture_img, t1, t2, t3) => {
    let bbox = find_bbox(Vec2.from_vec3(p1), Vec2.from_vec3(p2), Vec2.from_vec3(p3));
    let bb_min = bbox.min;
    let bb_max = bbox.max;
    for (let x = Math.floor(bb_min.x()); x <= Math.floor(bb_max.x()); x++) {
        for (let y = Math.floor(bb_min.y()); y <= Math.floor(bb_max.y()); y++) {
            let p = new Vec3(x, y, 0);
            let bary = get_barycentric_v3(p, p1, p2, p3);
            let outside = bary.data.some(v => v < 0);
            if (outside)
                continue;
            let z = p1.z() * bary.x() + p2.z() * bary.y() + p3.z() * bary.z();
            let i = i1 * bary.x() + i2 * bary.y() + i3 * bary.z();
            let t = t1.mul(bary.x()).add(t2.mul(bary.y())).add(t3.mul(bary.z()));
            let t_x = Math.floor(t.x() * texture_img.w);
            let t_y = texture_img.h - Math.floor(t.y() * texture_img.h) - 1;
            //console.log(`${t_x}, ${t_y}`);
            let t_idx = 4 * (t_x + t_y * texture_img.w);
            i = i < 0 ? 0 : i;
            if (true) {
                let color = {
                    r: 255 * i,
                    g: 255 * i,
                    b: 255 * i,
                    a: texture_img.data[t_idx + 3]
                };
                /*
                        |_
                       (0, 0)
                */
                let idx = Math.floor(x) + Math.floor(y) * canvas.width;
                if (z > z_buff[idx]) {
                    z_buff[idx] = z;
                    //console.log(idx);
                    draw_dot(x, y, color);
                }
            }
        }
    }
};
/*
for(let f in faces) {
    let light_dir = new Vec3(0, 0,-1);
    let face = faces[f];
    let w1, w2, w3: Vec3;
    let w1_, w2_, w3_: Vec4;
    let s1, s2, s3: Vec3;
    let t1, t2, t3: Vec2;
    let intensity: number;
    let normal: Vec3;
    let perspective = new Mat4();
    let center: number = 4;
    perspective.data[3][2] = - 1 / center;

    // t1, t2, t3 are texture coordinates of vertices of faces[f]
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

    w1_ = perspective.mul_v4(w1_).to_p();
    w2_ = perspective.mul_v4(w2_).to_p();
    w3_ = perspective.mul_v4(w3_).to_p();

    
    // s1, s2, s3 is screen coordinates of vertices of faces[f]
    s1 = new Vec3((1+w1.x())*canvas.width/2, (1+w1.y())*canvas.height/2, w1.z());
    s2 = new Vec3((1+w2.x())*canvas.width/2, (1+w2.y())*canvas.height/2, w2.z());
    s3 = new Vec3((1+w3.x())*canvas.width/2, (1+w3.y())*canvas.height/2, w3.z());
    
    
    normal = (w3.sub(w1)).cross(w2.sub(w1));
    normal.normalize();
    
    intensity = normal.dot(light_dir);
    
    
    if(intensity >= 0) {
        fill_triangle_texture(s1, s2, s3, Math.random(), z_buff, texture_img, t1, t2, t3);
    }
}
*/
let t = 0;
function step() {
    clear_canvas();
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
        fill_triangle_texture_(s1, s2, s3, i1, i2, i3, z_buff, texture_img, t1, t2, t3);
    }
    t += 0.1;
    paint_canvas();
    window.requestAnimationFrame(step);
}
console.log(t);
window.requestAnimationFrame(step);
