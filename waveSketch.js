let wave = (p) => {

    let STATE;
    const FOURIER = 1;
    const USER = 0;

    let canvas;
    let width;
    let height;

    let signal;
    let fourier;
    let path;

    let submit;
    let timeFactor;
    let maxAngularVelocity;


    p.setup = () => {
        canvas = p.createCanvas(window.innerWidth * .75, window.innerHeight * .90);


        canvas.parent('waveSketch');
        width = p.width;
        height = p.height/2;

        STATE = 0;


        signal = [];
        for (let i = 0; i < width/4; i++) {
            signal.push([0])
        }

        submit = p.createButton("Start Fourier")
        submit.mousePressed(buttonPress)
        submit.parent("waveSubmit")
        submit.addClass("btn").addClass("btn-outline-success").addClass("btn-block")

        timeFactor = document.getElementById("waveTimeSlider").value
        maxAngularVelocity = document.getElementById("waveFrequencySlider").value

    }

    p.draw = () => {

        p.background(0);
        p.translate(0, height);
        p.scale(1,-1)

        timeFactor = document.getElementById("waveTimeSlider").value
        maxAngularVelocity = document.getElementById("waveFrequencySlider").value

        if(STATE === USER){

            if(p.mouseIsPressed){
                mousePressed();
            }

            p.stroke(255);
            p.noFill();
            p.beginShape();

            for (let i = 0; i < width/2; i++) {
                p.vertex(i + width/2, signal[Math.round(i%(width/4))][0]);

            }
            p.endShape();
        }
        else{

            fourier.changeTimeMultiplier(timeFactor);
            if(fourier.maxFrequency !== maxAngularVelocity) fourier.recompute(maxAngularVelocity);
            drawPath();
        }
    }

    let mousePressed = () => {
        if(p.mouseX > width/2 && p.mouseY >0 && p.mouseY < height*2) {
            let x = Math.round((p.mouseX - width / 2 - 1) % (width / 4));
            let y = p.mouseY - height;

            let dy;

            if (y < 0) {

                dy = 2;

            } else dy = -2;

            let counter = 1;

            for (let i = -5; i <= 5; i++) {
                if(x+i >= signal.length) break;
                if(x+i < 0) continue;
                signal[x+i][0]+= Math.abs(signal[x+1] ) === height ? 0 : counter*dy;
                if (i <= 0) counter++;
                else counter--;
            }
        }
    }

    let drawPath = () => {
        let end = fourier.display(p);
        path.unshift(end.y);

        p.stroke(0, 255, 0);


        let startX = width / 2;
        let total = width - startX;

        p.line(end.x, end.y, startX, end.y);

        p.noFill();
        p.beginShape();
        for (let i = 0; i < path.length; i++) {
            p.vertex(startX + i, path[i]);
        }
        p.endShape();

        if (path.length === total) {
            path.pop();
        }
    }

    let buttonPress = () => {
        if(STATE === USER){
            fourier = new FourierEpicycles(signal, maxAngularVelocity, width/4, 0);
            console.log(timeFactor);
            STATE = FOURIER;

            path = [];
            submit.html("Pause");
            drawPath();
        }
        else if(STATE === FOURIER){
            STATE = USER;
            submit.html("Start Fourier")
        }
    }

    // p.windowResized = () => {
    //     p.resizeCanvas(window.innerWidth * .75, window.innerHeight * .90);
    //
    //     scaley(signal, p.height/2/height)
    //
    //     width = p.width;
    //     height = p.height/2;
    //
    //     fourier = new FourierEpicycles(signal, maxAngularVelocity, width/4, 0);
    //     path = []
    //
    // }
}


let waveSketch = new p5(wave, 'waveSketch');