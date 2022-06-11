import process from './ObjectParser.js';
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
