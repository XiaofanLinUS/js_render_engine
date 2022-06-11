import { Face, Vertex } from "./Model.js";
import head_data from "../obj/head.js";
let process = () => {
    let lines = head_data.split('\n');
    let faces = new Array;
    let vertices = new Array;
    for (let l in lines) {
        let info_arr = lines[l].split(' ');
        if (info_arr[0] == 'v') {
            let vertex = new Vertex(Number(info_arr[1]), Number(info_arr[2]), Number(info_arr[3]));
            vertices.push(vertex);
        }
        if (info_arr[0] == 'f') {
            let v1 = Number(info_arr[1].split('/')[0]) - 1;
            let v2 = Number(info_arr[2].split('/')[0]) - 1;
            let v3 = Number(info_arr[3].split('/')[0]) - 1;
            let face = new Face(v1, v2, v3);
            faces.push(face);
        }
    }
    return { faces, vertices };
};
export default process;