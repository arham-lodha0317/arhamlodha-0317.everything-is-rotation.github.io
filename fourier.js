class FourierEpicycles{

    data;
    cycles;
    dt
    multiplier;
    startx;
    starty
    time;
    maxFrequency

    constructor(signal, maxfrequency, startx, starty) {

        this.data = [];

        for (let i = 0; i < signal.length; i++) {
            this.data[i] = new Complex(signal[i]);
        }

        this.maxFrequency = maxfrequency;

        this.cycles = this.dft(this.data, maxfrequency);

        this.cycles.sort((c1,c2) => {
            return Math.abs(c1.frequency) - Math.abs(c2.frequency);
        })

        this.dt = 2 * Math.PI / this.data.length/10;

        this.multiplier = 1;

        this.startx = startx;
        this.starty = starty;
        this.time = 0;
    }

    dft = (data, maxFrequency) => {

        let X = [];
        let N = data.length;

        for (let frequency = -maxFrequency; frequency <= maxFrequency; frequency++) {

            let c = new Complex([0,0])

            for (let n = 0; n < N; n++) {

                const phi = (Math.PI * 2 * frequency * n)/N;
                c.add_(data[n].multiply(new Complex([Math.cos(phi), -Math.sin(phi)])));

            }

            c.divide_(N);

            let amp = Math.sqrt(c.imag * c.imag + c.real * c.real);
            let phase = Math.atan2(c.imag, c.real);

            X.push({amp,phase, frequency})
        }

        return X;
    }

    display = (p) => {

        p.noFill();

        p.stroke(255);

        let x = this.startx;
        let y = this.starty;

        for (let i = 0; i < this.cycles.length; i++) {

            const r = this.cycles[i].amp;
            const phi = this.cycles[i].phase;
            const frequency = this.cycles[i].frequency;

            p.stroke(255);

            p.circle(x, y, 2*r);

            p.stroke(255,0,0);

            p.line(x, y, x + r * Math.cos(phi + Math.PI * 2 * frequency * this.time), y + r * Math.sin(phi + Math.PI *2 * frequency * this.time));

            x += r * Math.cos(phi + Math.PI*2 * frequency * this.time);
            y += r * Math.sin(phi + Math.PI*2 * frequency * this.time);
        }

        p.stroke(0);

        this.time += this.dt * this.multiplier;

        if(this.time > Math.PI * 2) this.time = 0;

        return {x,y};

    }

    changeTimeMultiplier = (factor) => {this.multiplier =factor};

    getTotalTime = () => {
        return 2*Math.PI / this.dt/this.multiplier;
    }

    computeFullCycle = (p) =>{
        
        let path = [];

        for (let t = 0.0; t <= 2*Math.PI; t+=this.dt) {
            let x = 0;
            let y = 0;

            for (let n = 0; n < this.cycles.length; n++) {
                const amp = this.cycles[n].amp;
                const freq = this.cycles[n].frequency;
                const phase = this.cycles[n].phase;
                x += amp * p.cos(freq * p.TWO_PI * t + phase);
                y += amp * p.sin(freq * p.TWO_PI * t + phase);
            }

            path.push([x, y]);
        }

        return path;

    }

    recompute = (maxFrequency) => {
        this.maxFrequency = maxFrequency;
        this.cycles = this.dft(this.data, maxFrequency);
        this.cycles.sort((c1,c2) => {
            return Math.abs(c1.frequency) - Math.abs(c2.frequency);
        })
    }
}

class Complex{
    real;
    imag;

    constructor(value) {
        if (value.length === 1) {
            this.real = 0;
            this.imag = value[0];
        }
        else{
            this.real = value[0];
            this.imag = value[1];
        }
    }

    multiply = (c1) => {

        let real = this.real * c1.real - this.imag * c1.imag;
        let imag = this.real * c1.imag + this.imag * c1.real;

        return new Complex([real, imag]);
    }

    add = (c1) => {
        return new Complex([this.real + c1.real, this.imag + c1.imag]);
    }

    add_ = (c1) => {
        this.real += c1.real;
        this.imag += c1.imag;

    }

    divide_ = (d) => {
        this.real /= d;
        this.imag /= d;
    }

    toString = () => {
        return {real : this.real, imag: this.imag};
    }

}
