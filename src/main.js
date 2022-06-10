let canvas = document.querySelector("#view");
let ctx = canvas.getContext('2d');
let img_data;
let clear_canvas = () => {
    ctx.fillStyle = 'rgba(200,200,200,255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};
canvas.width = 500;
canvas.height = 500;
clear_canvas();
img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
clear_canvas();
let draw_dot = (x, y, r, g, b, a) => {
    y = canvas.height - y;
    let idx = (x + y * canvas.width) * 4;
    //ctx.fillStyle = color;
    //ctx.fillRect(x, y, 1, 1);
    img_data.data[idx] = r;
    img_data.data[idx + 1] = g;
    img_data.data[idx + 2] = b;
    img_data.data[idx + 3] = a;
};
let draw_line1 = (x0, y0, x1, y1, color) => {
    for (let t = 0; t <= 1; t += 0.01) {
        let x = x0 + (x1 - x0) * t;
        let y = y0 + (y1 - y0) * t;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }
};
ctx.fillStyle = 'black';
let draw_line2 = (x0, y0, x1, y1, color) => {
    for (let x = x0; x <= x1; x++) {
        let t = (x - x0) / (x1 - x0);
        let y = y0 + (y1 - y0) * t;
        draw_dot(x, y, 0, 0, 0, 255);
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
            draw_dot(y, x, 0, 0, 0, 255);
        }
        else {
            draw_dot(x, y, 0, 0, 0, 255);
        }
    }
};
let draw_line4 = (x0, y0, x1, y1) => {
    let transpose = false;
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
            draw_dot(y, x, 0, 0, 0, 255);
        }
        else {
            draw_dot(x, y, 0, 0, 0, 255);
        }
        error += derror;
        console.log(`${error}`);
        if (error > 1) {
            y += (y1 > y0) ? 1 : -1;
            error -= 1;
        }
    }
};
//clear_canvas();
console.profile("draw");
ctx.fillStyle = "black";
/* for (let i = 0; i < 1000000; i++) {
    //draw_line3(0, 0, 500, 500, "rbg(0,0,0)");
    draw_line4(0, 0, 500, 500);
} */
ctx.putImageData(img_data, 0, 0);
console.profileEnd("draw");
console.log(typeof (canvas));
clear_canvas();
/* draw_line2(0, 0, 500, 500, "black");
draw_line2(0, 0, 100, 500, "red");
draw_line2(0, 0, 500, 100, "blue");
draw_line2(400, 200, 0, 0, "blue"); */
clear_canvas();
/* draw_line4(0, 0, 500, 500);
draw_line4(0, 0, 100, 500);
draw_line4(0, 0, 500, 100);
draw_line4(400, 200, 0, 0);
 */
draw_line4(0, 500, 300, 0);
ctx.putImageData(img_data, 0, 0);
