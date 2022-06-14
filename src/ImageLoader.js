let load_img = (src) => {
    let img_promise;
    img_promise = new Promise((r, e) => {
        let img = new Image();
        img.src = src;
        img.onload = () => r(img);
        img.onerror = (event) => {
            console.log(event);
            e(new Error("Image loading error."));
        };
    }).then(im => {
        let img = im;
        let w = img.width;
        let h = img.height;
        let canvas = document.createElement("canvas");
        canvas.height = h;
        canvas.width = w;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return {
            w: w,
            h: h,
            data: ctx.getImageData(0, 0, w, h).data
        };
    });
    return img_promise;
};
export { load_img };
