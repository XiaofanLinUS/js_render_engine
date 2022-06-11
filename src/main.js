import process from './ObjectParser.js';
import { Vec2 } from './math/Vec2.js';
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
    y = canvas.height - y;
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
draw_line4(0, 0, 500, 500, red);
draw_line4(0, 0, 100, 500, green);
draw_line4(0, 0, 500, 100, blue);
draw_line4(400, 200, 0, 0, black);
draw_line4(0, 500, 300, 0, black);
draw_line4(218.443, 220.908, 214.421, 208.30225, black);
paint_canvas();
//clear_canvas();
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
    for (let i = 0; i < 3; i++) {
        let p1 = vertices[face.v_idx_arr[i]];
        let p2 = vertices[face.v_idx_arr[(i + 1) % 3]];
        let x0 = (p1.x + 1) * 0.5 * canvas.width;
        let y0 = (p1.y + 1) * 0.5 * canvas.height;
        let x1 = (p2.x + 1) * 0.5 * canvas.width;
        let y1 = (p2.y + 1) * 0.5 * canvas.height;
        draw_line4(x0, y0, x1, y1, black);
    }
}
paint_canvas();
clear_canvas();
let draw_line4_v = (p0, p1, color) => {
    draw_line4(p0.x, p0.y, p1.x, p1.y, color);
};
let draw_triangle = (v1, v2, v3, color) => {
    draw_line4_v(v1, v2, color);
    draw_line4_v(v2, v3, color);
    draw_line4_v(v3, v1, color);
};
let v1 = new Vec2(20, 50);
let v2 = new Vec2(400, 100);
let v3 = new Vec2(100, 300);
draw_triangle(v1, v2, v3, red);
let fill_triangle = (v1, v2, v3, color) => {
    if (v1.y == v2.y && v1.y == v3.y) {
        return;
    }
    let vs = [v1, v2, v3];
    vs.sort((a, b) => a.y < b.y ? -1 : 1);
    //vs.map(console.log);
    for (let y = vs[0].y; y <= vs[2].y; y++) {
        let x_l, x_r;
        let x1 = vs[0].x;
        let x2 = vs[1].x;
        let x3 = vs[2].x;
        let y1 = vs[0].y;
        let y2 = vs[1].y;
        let y3 = vs[2].y;
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
// test case 1:
/*
fill_triangle(new Vec2(20, 50),
new Vec2(400, 100),
new Vec2(100, 300), black);
 */
// test case 2:
fill_triangle(new Vec2(20, 50), new Vec2(90, 100), new Vec2(120, 500), red);
// test case 3:
fill_triangle(new Vec2(50, 60), new Vec2(10, 180), new Vec2(80, 300), blue);
// test case 4:
fill_triangle(new Vec2(150, 80), new Vec2(30, 120), new Vec2(80, 400), green);
/* // test case 5
fill_triangle(new Vec2(150, 80),
new Vec2(30, 120),
new Vec2(0, 400), black);
 */
/* fill_triangle(new Vec2(150, 0),
new Vec2(30, 0),
new Vec2(0, 400), black);
 */
fill_triangle(new Vec2(150, 0), new Vec2(30, 400), new Vec2(0, 400), black);
paint_canvas();
