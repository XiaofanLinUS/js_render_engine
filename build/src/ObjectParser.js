import { Face, Vertex } from "./Model.js";
import { Vec2 } from './math/Vec.js';
let process = async (file_name) => {
    try {
        let data = (await import(file_name)).default;
        let lines = data.split('\n');
        let faces = new Array;
        let vertices = new Array;
        let t_coords = new Array;
        for (let l in lines) {
            let info_arr = lines[l].split(' ');
            if (info_arr[0] == 'v') {
                let vertex = new Vertex(Number(info_arr[1]), Number(info_arr[2]), Number(info_arr[3]));
                vertices.push(vertex);
            }
            if (info_arr[0] == 'vt') {
                info_arr = info_arr.filter((w) => w.length > 0);
                t_coords.push(new Vec2(Number(info_arr[1]), Number(info_arr[2])));
            }
            if (info_arr[0] == 'f') {
                let v1 = Number(info_arr[1].split('/')[0]) - 1;
                let v2 = Number(info_arr[2].split('/')[0]) - 1;
                let v3 = Number(info_arr[3].split('/')[0]) - 1;
                let face;
                if (t_coords.length != 0) {
                    let t1 = Number(info_arr[1].split('/')[1]) - 1;
                    let t2 = Number(info_arr[2].split('/')[1]) - 1;
                    let t3 = Number(info_arr[3].split('/')[1]) - 1;
                    face = new Face(v1, v2, v3, vertices, t_coords, t1, t2, t3);
                }
                else {
                    face = new Face(v1, v2, v3, vertices);
                }
                faces.push(face);
            }
        }
        return { faces };
    }
    catch (e) {
        console.log("-----File reading error-----" + e);
        throw e;
    }
    return null;
};
export default process;
