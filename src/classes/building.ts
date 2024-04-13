import { Graphics } from "pixi.js";

export class Building extends Graphics {
    private health: number;
    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;

        this.health = 100;

        this.rect(0, 0, 100, 100);
        this.fill('blue');
    }
}