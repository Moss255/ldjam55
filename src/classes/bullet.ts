import { Graphics, Point } from 'pixi.js';
import { Enemy } from './enemy';

export class Bullet extends Graphics {
    private target: Point;
    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;

        this.target = new Point(this.x, this.y);

        this.rect(0, 0, 30, 30);
        this.fill('yellow');
    }

    setTarget(point: Point) {
        this.target = point;
        this.rotation = Math.atan2((point.y - this.y), (point.x - this.x)) % 360;
    }
}