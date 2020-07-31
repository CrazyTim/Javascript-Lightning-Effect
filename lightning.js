import Vector from './vector.js'

export default class Lightning {

    constructor(c) {
        this.config = c;
    }

    Cast(context, from, to) {

        context.save();

        if (!from || !to) {
            return;
        }
        //Main vector
        var v = new Vector(from.X1, from.Y1, to.X1, to.Y1);
        //skip cas if not close enough
        if (this.config.Threshold && v.Length() > context.canvas.width * this.config.Threshold) {
            return;
        }
        var vLen = v.Length();
        var refv = from;
        var lR = (vLen / context.canvas.width)
        //count of segemnets
        var segments = Math.floor(this.config.Segments * lR);
        //lenth of each
        var l = vLen / segments;


        for (let i = 1; i <= segments; i++) {
            //position in the main vector
            var dv = v.Multiply((1 / segments) * i);

            //add position noise
            if (i != segments) {
                dv.Y1 += l * Math.random();
                dv.X1 += l * Math.random();
            }

            //new vector for segment
            var r = new Vector(refv.X1, refv.Y1, dv.X1, dv.Y1);

            //background blur
            if (this.config.GlowColor && this.config.GlowWidth && this.config.GlowBlur && this.config.GlowAlpha) {
              this.Line(context, r, {
                  Color: this.config.GlowColor,
                  With: this.config.GlowWidth * lR,
                  Blur: this.config.GlowBlur * lR,
                  BlurColor: this.config.GlowColor,
                  Alpha: this.Random(this.config.GlowAlpha, this.config.GlowAlpha * 2) / 100

              });
            }

            //main line
            this.Line(context, r, {
                Color: this.config.Color,
                With: this.config.Width,
                Blur: this.config.Blur,
                BlurColor: this.config.BlurColor,
                Alpha: this.config.Alpha
            });
            refv = r;
        }

        this.Circle(context, to, 4, 2.5, '#fff');
        this.Circle(context, from, 4, 2.5, '#fff');

        context.restore();

    }

    Circle(context, p, radius, maxOffsetDistance, color) {
        const x = this.Random(p.X1 - maxOffsetDistance, p.X1 + maxOffsetDistance);
        const y = this.Random(p.Y1 - maxOffsetDistance, p.Y1 + maxOffsetDistance);
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.shadowBlur = radius * 2;
        context.shadowColor = color;
        context.fill();
    }

    Line(context, v, c) {
        context.beginPath();
        context.strokeStyle = c.Color;
        context.lineWidth = c.With;
        context.moveTo(v.X, v.Y);
        context.lineTo(v.X1, v.Y1);
        context.globalAlpha = c.Alpha;
        context.shadowBlur = c.Blur;
        context.shadowColor = c.BlurColor;
        context.stroke();
    }

    Random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}

