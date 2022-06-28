import { Img } from "./ImageLoader";
import { Vec2, Vec3 } from "./math/Linear";
import { Shader } from "./Shader";



class Draw {
    private ctx;
    private img_data;
    private z_buff;
    private w: number;
    private h: number;

    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = this.canvas.getContext('2d');
        this.img_data = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.z_buff = (new Array(canvas.height * canvas.width)).fill(-Infinity);
        this.w = canvas.width;
        this.h = canvas.height;
    }


    clear() {
        this.ctx.fillStyle = 'rgba(0,0,0,255)';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.img_data = this.ctx.getImageData(0, 0, this.w, this.h);
        this.z_buff = (new Array(this.w * this.h)).fill(-Infinity);
    };

    paint() {
        this.ctx.putImageData(this.img_data, 0, 0);

    };

    draw_dot(x: number, y: number, c: Color) {
        if (x >= this.w || x < 0 || y >= this.h || y < 0) {
            return;
        }
        x = Math.floor(x);
        y = Math.floor(y);
        y = this.h - y - 1;
        let idx = (x + y * this.w) * 4;
        this.img_data.data[idx] = c.r;
        this.img_data.data[idx + 1] = c.g;
        this.img_data.data[idx + 2] = c.b;
        this.img_data.data[idx + 3] = c.a;
    }



    fill_triangle2(p1: Vec2, p2: Vec2, p3: Vec2, color: Color) {
        let bbox = find_bbox(p1, p2, p3, this.w, this.h);

        for (let x = bbox.min.data[0]; x <= bbox.max.data[0]; x++) {
            for (let y = bbox.min.data[1]; y <= bbox.max.data[1]; y++) {
                let p = new Vec2(x, y);
                if (is_inside(p, p1, p2, p3)) {
                    this.draw_dot(p.x(), p.y(), color);
                }
            }
        }
    }

    fill_triangle(v1: Vec2, v2: Vec2, v3: Vec2, color: Color) {
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
            let x_l: number, x_r: number;
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
            } else {
                delta_y = y - y2;
                x_l = (x3 - x2) / (y3 - y2) * delta_y + x2;
            }
            //draw_line4(x_l, y, x_r, y, color);
            if (x_l > x_r) {
                [x_l, x_r] = [x_r, x_l];
            }

            for (let x = x_l; x <= x_r; x++) {
                this.draw_dot(x, y, color);
                this.draw_dot(x, y, color);
            }
        }
    }

    draw_line1(x0: number, y0: number, x1: number, y1: number, color: string) {
        for (let t = 0; t <= 1; t += 0.01) {
            let x = x0 + (x1 - x0) * t;
            let y = y0 + (y1 - y0) * t;
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }

    draw_line2(x0: number, y0: number, x1: number, y1: number, color: Color) {
        for (let x = x0; x <= x1; x++) {
            let t = (x - x0) / (x1 - x0);
            let y = y0 + (y1 - y0) * t;
            this.draw_dot(x, y, color);
        }

    }

    draw_line3(x0: number, y0: number, x1: number, y1: number, color: Color): void {
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
                this.draw_dot(y, x, color);
            } else {
                this.draw_dot(x, y, color);
            }
        }
    }



    draw_line4(x0: number, y0: number, x1: number, y1: number, color: Color): void {
        let transpose: boolean = false;

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
                this.draw_dot(y, x, color);
            } else {
                this.draw_dot(x, y, color);
            }
            error += derror;

            if (error > 1) {
                y += (y1 > y0) ? 1 : -1;
                error -= 1;
            }
        }
    }


    fill_triangle_texture(p1: Vec3, p2: Vec3, p3: Vec3, intensity: number, z_buff: number[], texture_img: Img, t1: Vec2, t2: Vec2, t3: Vec2) {
        let bbox = find_bbox(Vec2.from_vec3(p1), Vec2.from_vec3(p2), Vec2.from_vec3(p3), this.w, this.h);
        let bb_min = bbox.min;
        let bb_max = bbox.max;

        for (let x = Math.floor(bb_min.x()); x <= Math.floor(bb_max.x()); x++) {
            for (let y = Math.floor(bb_min.y()); y <= Math.floor(bb_max.y()); y++) {
                let p: Vec3 = new Vec3(x, y, 0);
                let bary: Vec3 = get_barycentric_v3(p, p1, p2, p3);
                let outside: boolean = bary.data.some(v => v < 0);
                if (outside) continue;
                let z = p1.z() * bary.x() + p2.z() * bary.y() + p3.z() * bary.z();
                let t = t1.mul(bary.x()).add(t2.mul(bary.y())).add(t3.mul(bary.z()));

                let t_x = Math.floor(t.x() * texture_img.w);

                let t_y = texture_img.h - Math.floor(t.y() * texture_img.h) - 1;

                let t_idx = 4 * (t_x + t_y * texture_img.w);

                let color: Color = {
                    r: 255 * intensity,
                    g: 255 * intensity,
                    b: 255 * intensity,
                    a: texture_img.data[t_idx + 3]
                }
                let idx = Math.floor(x) + Math.floor(y) * this.canvas.width;
                if (z > z_buff[idx]) {
                    z_buff[idx] = z;
                    this.draw_dot(x, y, color);
                }
            }
        }
    }


    fill_triangle_texture_(p1: Vec3, p2: Vec3, p3: Vec3, i1: number, i2: number, i3: number, z_buff: number[], texture_img: Img, t1: Vec2, t2: Vec2, t3: Vec2) {
        let bbox = find_bbox(Vec2.from_vec3(p1), Vec2.from_vec3(p2), Vec2.from_vec3(p3), this.w, this.h);
        let bb_min = bbox.min;
        let bb_max = bbox.max;

        for (let x = Math.floor(bb_min.x()); x <= Math.floor(bb_max.x()); x++) {
            for (let y = Math.floor(bb_min.y()); y <= Math.floor(bb_max.y()); y++) {
                let p: Vec3 = new Vec3(x, y, 0);
                let bary: Vec3 = get_barycentric_v3(p, p1, p2, p3);
                let outside: boolean = bary.data.some(v => v < 0);
                if (outside) continue;
                let z = p1.z() * bary.x() + p2.z() * bary.y() + p3.z() * bary.z();
                let i = i1 * bary.x() + i2 * bary.y() + i3 * bary.z();

                let t = t1.mul(bary.x()).add(t2.mul(bary.y())).add(t3.mul(bary.z()));

                let t_x = Math.floor(t.x() * texture_img.w);

                let t_y = texture_img.h - Math.floor(t.y() * texture_img.h) - 1;

                //console.log(`${t_x}, ${t_y}`);
                let t_idx = 4 * (t_x + t_y * texture_img.w);

                i = i < 0 ? 0 : i;

                if (true) {
                    let color: Color = {
                        r: 255 * i,
                        g: 255 * i,
                        b: 255 * i,
                        a: texture_img.data[t_idx + 3]
                    }
                    /*
                            |_
                           (0, 0)
                    */
                    let idx = Math.floor(x) + Math.floor(y) * this.w;
                    if (z > z_buff[idx]) {
                        z_buff[idx] = z;
                        //console.log(idx);
                        this.draw_dot(x, y, color);
                    }
                }

            }
        }
    }

    fill_triangle_shader([p1, p2, p3]: Vec3[], shader: Shader) {
        let bbox = find_bbox(Vec2.from_vec3(p1), Vec2.from_vec3(p2), Vec2.from_vec3(p3), this.w, this.h);
        let bb_min = bbox.min;
        let bb_max = bbox.max;

        for (let x = Math.floor(bb_min.x()); x <= Math.floor(bb_max.x()); x++) {
            for (let y = Math.floor(bb_min.y()); y <= Math.floor(bb_max.y()); y++) {
                let p: Vec3 = new Vec3(x, y, 0);
                let bary: Vec3 = get_barycentric_v3(p, p1, p2, p3);
                let outside: boolean = bary.data.some(v => v < 0);
                if (outside) continue;
                let z = p1.z() * bary.x() + p2.z() * bary.y() + p3.z() * bary.z();
                let color = shader.fragment(bary);
                let idx = Math.floor(x) + Math.floor(y) * this.w;
                if (z > this.z_buff[idx]) {
                    this.z_buff[idx] = z;
                    this.draw_dot(x, y, color);
                }
            }
        }
    }

    draw_line4_v(p0: Vec2, p1: Vec2, color: Color) {
        this.draw_line4(p0.data[0], p0.data[1], p1.data[0], p1.data[1], color);
    }

    draw_triangle(v1: Vec2, v2: Vec2, v3: Vec2, color: Color) {
        this.draw_line4_v(v1, v2, color);
        this.draw_line4_v(v2, v3, color);
        this.draw_line4_v(v3, v1, color);
    }


    fill_triangle_vec3(p1: Vec3, p2: Vec3, p3: Vec3, color: Color, z_buff: number[]) {
        let bbox = find_bbox(Vec2.from_vec3(p1), Vec2.from_vec3(p2), Vec2.from_vec3(p3), this.w, this.h);
        let bb_min = bbox.min;
        let bb_max = bbox.max;

        for (let x = Math.floor(bb_min.x()); x <= Math.floor(bb_max.x()); x++) {
            for (let y = Math.floor(bb_min.y()); y <= Math.floor(bb_max.y()); y++) {
                let p: Vec3 = new Vec3(x, y, 0);
                let bary: Vec3 = get_barycentric_v3(p, p1, p2, p3);
                let outside: boolean = bary.data.some(v => v < 0);
                let z = p1.z() * bary.x() + p2.z() * bary.y() + p3.z() * bary.z();

                //console.log(z);
                if (outside) continue;
                if (Math.floor(x) == 311 && Math.floor(y) == (499 - 440)) {
                    console.log("Hit");

                }
                let idx = Math.floor(x) + Math.floor(y) * this.w;
                if (z > z_buff[idx]) {
                    z_buff[idx] = z;
                    this.draw_dot(x, y, color);
                }
            }
        }
    }
};

interface Bbox {
    min: Vec2,
    max: Vec2
};

interface Color {
    r: number,
    g: number,
    b: number,
    a: number
};


let find_bbox = (p1: Vec2, p2: Vec2, p3: Vec2, w: number, h: number): Bbox => {
    let min_x = [p1, p2, p3].reduce((p, c) => p.data[0] < c.data[0] ? p : c).data[0];
    let min_y = [p1, p2, p3].reduce((p, c) => p.data[1] < c.data[1] ? p : c).data[1];

    let max_x = [p1, p2, p3].reduce((p, c) => p.data[0] > c.data[0] ? p : c).data[0];
    let max_y = [p1, p2, p3].reduce((p, c) => p.data[1] > c.data[1] ? p : c).data[1];

    min_x = min_x < 0 ? 0 : min_x;
    min_y = min_y < 0 ? 0 : min_y;
    max_x = max_x >= w ? w : max_x;
    max_y = max_y >= h ? h : max_y;
    return { min: new Vec2(min_x, min_y), max: new Vec2(max_x, max_y) };
}

let get_barycentric = (p: Vec2, a: Vec2, b: Vec2, c: Vec2): Vec3 => {
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
}

let get_barycentric_v3 = (p: Vec3, a: Vec3, b: Vec3, c: Vec3): Vec3 => {
    let ab = b.sub(a);
    let ac = c.sub(a);
    let pa = a.sub(p);


    let s1 = new Vec3(ab.x(), ac.x(), pa.x());
    let s2 = new Vec3(ab.y(), ac.y(), pa.y());

    let u = s1.cross(s2);

    if (Math.abs(u.z()) < 1e-2) {
        return new Vec3(-1, 1, 1);
    }


    let b_coord = new Vec3(1.0 - (u.x() + u.y()) / u.z(), u.x() / u.z(), u.y() / u.z());
    return b_coord;
}

let is_inside = (p: Vec2, a: Vec2, b: Vec2, c: Vec2): boolean => {
    let b_coord = get_barycentric(p, a, b, c);

    let data = b_coord.data;

    let failed = data.some(v => v < - 0.05);

    return !failed;
}

export { Draw };
export type { Color };
