import { Graphics } from "pixi.js";

export class Tree extends Graphics {
    constructor(x: number, y: number) {
        super();

        // this.anchor.set(0.5);

        this.x = x;
        this.y = y;

        this.rect(0, 0, 50, 50);
        this.fill('green');
    }
}