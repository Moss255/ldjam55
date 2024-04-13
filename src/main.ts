import { Building } from './classes/building';
import './style.css'
import { Application, FederatedPointerEvent, Ticker, Point } from 'pixi.js';
import lodash from 'lodash';
import { Tree } from './classes/tree';
import { Enemy } from './classes/enemy';
import { Bullet } from './classes/bullet';
import { System } from './classes/system';

const ENEMY_SPAWN_SECONDS: number = 4;

class Game {
  private app: Application;
  private water: number;
  private buildings: Building[];
  private bullets: Bullet[];
  private tree: Tree;
  private population: number;
  private enemies: Enemy[];
  private enemySpawnSeconds: number;
  constructor() {
    this.app = new Application();
    this.water = 1000;
    this.buildings = [];
    this.population = 0;
    this.enemySpawnSeconds = ENEMY_SPAWN_SECONDS;
    this.enemies = [];
    this.bullets = [];
  }

  async setup() {
    await this.app.init({
      autoStart: false,
      resizeTo: document.querySelector('#app') as HTMLElement,
      sharedTicker: true
    });
    document.querySelector('#app')?.appendChild(this.app.canvas);
  }

  async preload() {
    console.log('preloading assets');
  }
  
  async load() {
    this.buildings = [0, 0, 0, 0].map((_) => {
      const x = lodash.random(0, this.app.screen.width)
      const y = lodash.random(0, this.app.screen.height);
      return new Building(x, y);
    });
    this.population = this.buildings.length * 40;
    console.log(this.population);
  }
  
  async start() {
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.eventMode = 'static';
    this.buildings.forEach((building) => {
      this.app.stage.addChild(building);
    });

    this.app.stage.on('pointerdown', this.createNewTree);
    this.app.stage.on('pointerdown', this.fire);

    this.app.ticker.add(this.handleBulletProjection);
    this.app.ticker.add(this.spawnNewEnemy);
  }

  fire = (e: FederatedPointerEvent) => {
    console.log('Firing bullet');
    const bullet = new Bullet(this.tree.x, this.tree.y);
    bullet.setTarget(new Point(e.x, e.y));
    this.bullets.push(bullet);
    this.app.stage.addChild(bullet);
  }

  handleBulletProjection = (ticker: Ticker) => {
    lodash.filter(this.bullets, (bullet: Bullet) => bullet.destroyed);
    lodash.filter(this.enemies, (enemy: Enemy) => enemy.destroyed);
    this.bullets.forEach((bullet) => {
      bullet.x += ticker.deltaTime * Math.cos(bullet.rotation);
      bullet.y += ticker.deltaTime * Math.sin(bullet.rotation);
      lodash.forEach(this.enemies, (enemy: Enemy) => {
        if (enemy.destroyed) return true;
        if (System.collision(bullet, enemy)) {
          enemy.destroy();
          bullet.destroy();
          return false;
        }
        return true;
      });
    });
   
  }

  createNewTree = (e: FederatedPointerEvent) => {
    if (this.water <= 0) {
      console.log('No more water left');
      return;
    }

    if (this.tree) {
      return;
    }

    console.log(`Planting tree at ${e.x}, ${e.y}`);
    this.tree = new Tree(e.x, e.y);
    this.app.stage.addChild(this.tree);
    this.water -= 100;
    console.log(`Water level ${this.water}`);
  }

  spawnNewEnemy = (ticker: Ticker) => {
    this.enemySpawnSeconds += ticker.elapsedMS;
    // console.log(this.enemySpawnSeconds / 1000);
      if (this.enemySpawnSeconds / 1000 > 4) {
        console.log(`Spawning new enemy`);
        this.enemySpawnSeconds = ENEMY_SPAWN_SECONDS;
        const x = lodash.random(0, this.app.screen.width)
        const y = lodash.random(0, this.app.screen.height);
        const enemy = new Enemy(x, y);
        this.app.stage.addChild(enemy);
        this.enemies.push(enemy);
      }
  }
}

(async () => {
  const game = new Game();
  await game.setup();
  await game.preload();
  await game.load();
  await game.start();
})()
