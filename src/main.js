import process from './ObjectParser.js';
import { Vec2, Vec3 } from './math/Vec.js';
let canvas = document.querySelector("#view");
let ctx = canvas.getContext('2d');
let img_data;
let clear_canvas = () => {
    ctx.fillStyle = 'rgba(200,200,200,255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
canvas.width = 500;
canvas.height = 500;
clear_canvas();
img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
let paint_canvas = () => {
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
    if (Math.abs(n.z()) < 1) {
        return new Vec3(-1, 1, 1);
    }
    let b_coord = n.div(n.z());
    b_coord = new Vec3(1 - b_coord.x() - b_coord.y(), b_coord.x(), b_coord.y());
    return b_coord;
};
let is_inside = (p, a, b, c) => {
    let b_coord = get_barycentric(p, a, b, c);
    let data = b_coord.data;
    let failed = data.some(v => v < 0);
    return !failed;
};
let fill_triangle2 = (p1, p2, p3, color) => {
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
let faces, vertices;
if (model) {
    faces = model.faces;
    vertices = model.vertices;
}
else {
    throw new Error("what's up");
}
for (let f in faces) {
    let face = faces[f];
    let v1 = new Vec2((1 + vertices[face.v_idx_arr[0]].data.x()) * canvas.width / 2, (1 + vertices[face.v_idx_arr[0]].data.y()) * canvas.height / 2);
    let v2 = new Vec2((1 + vertices[face.v_idx_arr[1]].data.x()) * canvas.width / 2, (1 + vertices[face.v_idx_arr[1]].data.y()) * canvas.height / 2);
    let v3 = new Vec2((1 + vertices[face.v_idx_arr[2]].data.x()) * canvas.width / 2, (1 + vertices[face.v_idx_arr[2]].data.y()) * canvas.height / 2);
    console.log(v1);
    fill_triangle2(v1, v2, v3, {
        r: 256 * Math.random(),
        g: 256 * Math.random(),
        b: 256 * Math.random(),
        a: 255
    });
}
paint_canvas();
