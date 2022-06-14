interface Img {
    w: number,
    h: number,
    data: Uint8ClampedArray
}

let load_img = (src: string): Promise<Img> => {
    let img_promise: Promise<Img>;

    img_promise = new Promise((r, e)=>{
        let img = new Image();
        img.src = src;
        img.onload = () => r(img);
        img.onerror = (event) => {
            console.log(event);
            e(new Error("Image loading error."));
        };
    }).then(im=> {
        let img: HTMLImageElement = im as HTMLImageElement;
        let w = img.width;
        let h = img.height;
        let canvas = document.createElement("canvas");
        canvas.height = h;
        canvas.width  = w;
        
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
    
        return {
            w: w,
            h: h,
            data: ctx.getImageData(0, 0, w, h).data
        };
    });
    return img_promise;
}

export {Img, load_img};