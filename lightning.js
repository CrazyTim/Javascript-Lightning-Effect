import Vector from './vector.js'

export default class Lightning {

    constructor(c) {
        this.config = c;
    }

    Cast(ctx, startPoint, endPoint, settings = {}) {

        ctx.save();

        if (typeof ctx !== 'object' ||
          typeof startPoint !== 'object' ||
          typeof endPoint !== 'object' ||
          typeof settings !== 'object') return;

        if (typeof settings.circleStartRadius === 'undefined') settings.circleStartRadius = 5;
        if (typeof settings.circleEndRadius === 'undefined') settings.circleEndRadius = 5;
        if (typeof settings.segmentLength === 'undefined') settings.segmentLength = 10;

        const v = new Vector(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        const vLength = v.length();

        // Do nothing if too far away:
        if (this.config.Threshold) {
          if (vLength > this.config.Threshold) return;
        }

        const segmentCount = Math.floor(vLength / settings.segmentLength);
        const segmentLengthHalf = settings.segmentLength / 2;
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
              this.Line(ctx, thisVector, {
                  Color: this.config.GlowColor,
                  With: this.config.GlowWidth,
                  Blur: this.config.GlowBlur,
                  BlurColor: this.config.GlowColor,
                  Alpha: this.Random(this.config.GlowAlpha, this.config.GlowAlpha * 2) / 100,
              });
            }

            // Draw line:
            this.Line(ctx, thisVector, {
                Color: this.config.Color,
                With: this.config.Width,
                Blur: this.config.Blur,
                BlurColor: this.config.BlurColor,
                Alpha: this.config.Alpha,
            });

            lastVector = thisVector;

        }

        this.Circle(ctx, startPoint, settings.circleStartRadius, 2.5, '#fff');
        this.Circle(ctx, endPoint, settings.circleEndRadius, 2.5, '#fff');

        ctx.restore();

    }

    Line(ctx, v, c) {
        ctx.beginPath();
        ctx.strokeStyle = c.Color;
        ctx.lineWidth = c.With;
        ctx.moveTo(v.x1, v.y1);
        ctx.lineTo(v.x2, v.y2);
        ctx.globalAlpha = c.Alpha;
        ctx.shadowBlur = c.Blur;
        ctx.shadowColor = c.BlurColor;
        ctx.stroke();
    }

    Circle(ctx, p, radius, maxOffsetDistance, color) {
        if (!radius) return; // Don't draw circle if radius is 0.
        const o = maxOffsetDistance / 2;
        const x = this.Random(p.x - o, p.x + o);
        const y = this.Random(p.y - o, p.y + o);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.shadowBlur = radius * 2;
        ctx.shadowColor = color;
        ctx.fill();
    }

    Random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}
