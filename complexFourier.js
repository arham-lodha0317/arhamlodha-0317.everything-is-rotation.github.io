let complexFourier = (p) => {
    const USER = 1;
    const DEFAULT = 0;
    const FOURIER = 2;
    let STATE;

    let signalViewer;
    let canvas;
    let width;
    let height;

    let timeFactor;
    let maxFrequency;

    let signal;
    let fourier;
    let path;
    let start;
    let pathBtn;
    let cycle;

    p.setup = () => {
        canvas = p.createCanvas(window.innerWidth * .75, window.innerHeight * .90);
        canvas.parent('sketch');
        width = p.width;
        height = p.height;

        STATE = DEFAULT;
        signal = defaultSignal;

        if(width < height) scalex(signal, width * .8)
        else scaley(signal, height * 0.8)


        timeFactor = document.getElementById("TimeSlider").value
        maxFrequency = document.getElementById("FrequencySlider").value

        start = p.createButton("Draw your own figure!")
        start.mousePressed(btnPressed)
        start.parent("csubmit")
        start.addClass("btn").addClass("btn-outline-success").addClass("btn-block")

        pathBtn = p.createButton("View Path")
        pathBtn.mousePressed(pathBtnPressed)
        pathBtn.parent("pathViewer")
        pathBtn.addClass("btn").addClass("btn-outline-success").addClass("btn-block")

        fourier = new FourierEpicycles(signal, maxFrequency, 0,0);
        path = []
        cycle = fourier.computeFullCycle(p)

        signalViewer=false
    }

    p.draw = () => {
        p.background(0)

        p.translate(width/2, height/2);
        p.scale(1,1)

        timeFactor = document.getElementById("TimeSlider").value
        maxFrequency = document.getElementById("FrequencySlider").value



        if(STATE === USER && !signalViewer){
            if(p.mouseIsPressed){
                mousePressed();
            }
            else if(signal.length !== 0){
                path = []
                fourier = new FourierEpicycles(signal, maxFrequency, 0,0)
                STATE = FOURIER;
            }

            p.stroke(0,255,0)
            p.beginShape();

            for (let i = 0; i < signal.length; i++) {
                p.vertex(signal[i][0], signal[i][1]);
            }

            p.endShape(p.CLOSE);

        }
        else if((STATE===DEFAULT || STATE === FOURIER) && !signalViewer){
            fourier.changeTimeMultiplier(timeFactor);
            if(fourier.maxFrequency !== maxFrequency){
                fourier.recompute(maxFrequency);
                path = []
            }
            drawPath();
        }
        else{
            fourier.changeTimeMultiplier(timeFactor);
            if(fourier.maxFrequency !== maxFrequency){
                fourier.recompute(maxFrequency);
                path = []
                cycle = fourier.computeFullCycle(p);
            }

            drawPathSignal();
        }
    }

    drawPath = () => {
        let end = fourier.display(p);
        path.unshift(end);

        p.stroke(0,255,0);
        let total = fourier.getTotalTime();

        p.noFill();
        p.beginShape();
        for (let i = 0; i < path.length; i++) {
            p.vertex(path[i].x, path[i].y);
        }
        p.endShape();

        if(path.length === total){
            path.pop();
        }
    }

    let mousePressed = () => {
        if(p.mouseX > 0 && p.mouseX < width){
            if(p.mouseY > 0 && p.mouseY < height){
                signal.push([p.mouseX - width/2, p.mouseY - height/2]);
            }
        }

    }

    let btnPressed = () => {
        console.log(STATE)
        if(STATE === DEFAULT){
            STATE = USER;
            start.html("Return to default")
            signal=[];
            signalViewer = false;
            path = []
        }
        else{
            STATE = DEFAULT
            start.html("Draw your own figure!")

            signal = defaultSignal;

            if(width < height) scalex(signal, width * .8)
            else scaley(signal, height * -0.8)
            fourier = new FourierEpicycles(signal, maxFrequency, 0, 0)
            signalViewer = false
            path = []
        }
    }

    let pathBtnPressed = () => {
        if(signalViewer){
            pathBtn.html("View Path");
        }
        else{
            pathBtn.html("View Cycles");
            cycle = fourier.computeFullCycle(p)
        }

        signalViewer = !signalViewer;
    }

    let drawPathSignal = () => {
        p.stroke(0,255,0);

        p.beginShape();

        for (let i = 0; i < cycle.length; i++) {
            p.vertex(cycle[i][0], cycle[i][1])
        }

        p.endShape();

    }

    // p.windowResized = () => {
    //     p.resizeCanvas(window.innerWidth * .75, window.innerHeight * .90, true);
    //
    //     width = p.width;
    //     height = p.height;
    //
    //     if(width < height) scalex(signal, width * .8)
    //     else scaley(signal, height * -0.8)
    //
    //     fourier = new FourierEpicycles(signal, maxFrequency, 0, 0);
    //
    //     path = []
    //
    //     if(signalViewer){
    //         if(width < height) scalex(cycle, width * .8)
    //         else scaley(cycle, height * -0.8)
    //     }
    //
    // }
}

let complexFourierSketch = new p5(complexFourier, 'complexFourierSketch');
