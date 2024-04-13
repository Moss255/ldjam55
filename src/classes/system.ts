import { Point, Container } from 'pixi.js';

export class System {
    static distanceBetweenPoints(point1: Point, point2: Point) {
        const x = Math.pow((point1.x - point2.x), 2);
        const y = Math.pow((point1.y - point2.y), 2);
        return Math.sqrt((x + y));
    }

    static collision(object1: Container, object2: Container)
    {
        const bounds1 = object1.getBounds();
        const bounds2 = object2.getBounds();

        return (
            bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y
        );
    }
}


