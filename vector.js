export default class Vector {

    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    length() {
        return Math.sqrt(Math.pow(this.lengthX(), 2) + Math.pow(this.lengthY(), 2));
    }

    lengthX() {
        return this.x2 - this.x1;
    }

    lengthY() {
        return this.y2 - this.y1;
    }

}
