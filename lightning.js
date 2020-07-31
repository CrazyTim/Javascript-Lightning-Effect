import Vector from './vector.js'

export default class Lightning {

    constructor(c) {
        this.config = c;
    }

    Cast(context, startPoint, endPoint, showEndCircle = true, segmentLength = 10) {

        context.save();

        if (!startPoint || !endPoint) return;

        const v = new Vector(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        const vLength = v.length();

        // Do nothing if too far away:
        if (this.config.Threshold) {
          if (vLength > this.config.Threshold) return;
        }

        const segmentCount = Math.floor(vLength / segmentLength);
        const segmentLengthHalf = segmentLength / 2;
        const segmentlengthX = v.lengthX() / segmentCount;
        const segmentlengthY = v.lengthY() / segmentCount;

        let lastVector = new Vector(0, 0, startPoint.x, startPoint.y);

        for (let i = 1; i <= segmentCount; i++) {

            const newTo = {
              x: v.x1 + ( segmentlengthX * i ),
              y: v.y1 + ( segmentlengthY * i ),
            };

            // Add noise (excluding the last segment):
            if (i != segmentCount) {
              newTo.x += this.Random(-segmentLengthHalf, segmentLengthHalf + 1);
              newTo.y += this.Random(-segmentLengthHalf, segmentLengthHalf + 1);
            }

            const thisVector = new Vector(lastVector.x2, lastVector.y2, newTo.x, newTo.y);

            // Draw background blur:
            if (this.config.GlowColor && this.config.GlowWidth && this.config.GlowBlur && this.config.GlowAlpha) {
              this.Line(context, thisVector, {
                  Color: this.config.GlowColor,
                  With: this.config.GlowWidth,
                  Blur: this.config.GlowBlur,
                  BlurColor: this.config.GlowColor,
                  Alpha: this.Random(this.config.GlowAlpha, this.config.GlowAlpha * 2) / 100,
              });
            }

            // Draw line:
            this.Line(context, thisVector, {
                Color: this.config.Color,
                With: this.config.Width,
                Blur: this.config.Blur,
                BlurColor: this.config.BlurColor,
                Alpha: this.config.Alpha,
            });

            lastVector = thisVector;

        }

        this.Circle(context, endPoint, 5, 3, '#fff');
        if (showEndCircle) this.Circle(context, startPoint, 4, 2.5, '#fff');

        context.restore();

    }

    Line(context, v, c) {
        context.beginPath();
        context.strokeStyle = c.Color;
        context.lineWidth = c.With;
        context.moveTo(v.x1, v.y1);
        context.lineTo(v.x2, v.y2);
        context.globalAlpha = c.Alpha;
        context.shadowBlur = c.Blur;
        context.shadowColor = c.BlurColor;
        context.stroke();
    }

    Circle(context, p, radius, maxOffsetDistance, color) {
        const o = maxOffsetDistance / 2;
        const x = this.Random(p.x - o, p.x + o);
        const y = this.Random(p.y - o, p.y + o);
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.shadowBlur = radius * 2;
        context.shadowColor = color;
        context.fill();
    }

    Random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}
