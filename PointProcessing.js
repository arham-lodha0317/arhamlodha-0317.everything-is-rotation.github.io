center_points = function center_points(pts){
    let bb = bounding_box(pts);

    let cx = (bb[1]+bb[0])/2;
    let cy = (bb[2] + bb[3])/2;

    for (let i = 0; i < pts.length; i++) {
        pts[i][0] -= cx;
        pts[i][1] -= cy;
    }

    return pts;
}

scalex = function (pts, width){
    let bb = bounding_box(pts);
    let scale = width / (bb[1] - bb[0]);

    for (let i = 0; i < pts.length; i++) {
        pts[i][0] *= scale;
        pts[i][1] *= scale;
    }
}

scaley = (pts,width) =>{
    let bb = bounding_box(pts);
    let scale = width / (bb[2] - bb[3]);

    for (let i = 0; i < pts.length; i++) {
        pts[i][0] *= scale;
        pts[i][1] *= scale;
    }
}

function bounding_box(points) {
    let xs = points.map(function(v,i) {return v[0];});
    let ys = points.map(function(v,i) {return v[1];});
    let minx = Math.min.apply(Math,xs);
    let maxx = Math.max.apply(Math,xs);
    let miny = Math.min.apply(Math,ys);
    let maxy = Math.max.apply(Math,ys);
    return [minx,maxx,miny,maxy];
}

convertToPolar = (pts) => {
    let cts = [];

    for (let i = 0; i < pts.length; i++) {
        cts.push([Math.sqrt(pts[i][0] ** 2 + pts[i][1] ** 2), Math.atan2(pts[i][1], pts[i][0])])
    }

    return cts;
}
