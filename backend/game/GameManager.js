import { Map as GameMap } from './Map.js';
import { Player } from './Player.js';
import { Bomb } from './Bomb.js';
import { GameLoop } from './GameLoop.js';
import { PowerUp, randomPowerUpType } from './PowerUp.js';

export class GameManager {
  constructor() {
    this.state = this.createInitialState();
    this.gameStateHandlers = new Set();
    this.gameOverHandlers = new Set();
    this.gameLoop = new GameLoop(20); // Reduced from 30 to 20 Hz for better performance
  }

  createInitialState() {
    return {
      tick: 0,
      running: false,
      map: null,
      players: new Map(),
      bombs: new Map(),
      explosions: [],
      powerups: [],
      bombIdCounter: 0,
      startTime: null
    };
  }

  startGame(playerList) {
    console.log('🎮 GameManager: Starting game with players:', playerList);

    this.state = this.createInitialState();
    this.state.running = true;
    this.state.startTime = Date.now();
    this.state.map = new GameMap();

    // Spawn positions (corners)
    const spawnPositions = [
      { x: 1, y: 1 },
      { x: 13, y: 1 },
      { x: 1, y: 13 },
      { x: 13, y: 13 }
    ];

    // Create players
    playerList.forEach((p, idx) => {
      const pos = spawnPositions[idx];
      const player = new Player(p.id, p.name, pos.x, pos.y, idx);
      this.state.players.set(p.id, player);
    });

    // Start game loop
    this.gameLoop.start((tick) => this.onTick(tick));
  }

  onTick(tick) {
    this.state.tick = tick;

    // Update bombs
    this.updateBombs();

    // Update explosions
    this.updateExplosions();

    // Check power-up collisions
    this.checkPowerUpCollisions();

    // Check win condition
    this.checkWinCondition();

    // Broadcast game state
    this.emitGameState();
  }

  updateBombs() {
    const toExplode = [];

    this.state.bombs.forEach((bomb, id) => {
      const shouldExplode = bomb.tick();

      if (shouldExplode) {
        toExplode.push(id);
      }
    });

    // Explode bombs
    toExplode.forEach(bombId => {
      const bomb = this.state.bombs.get(bombId);
      const explosionData = bomb.explode(this.state.map);

      // Create explosion
      this.state.explosions.push({
        id: 'exp_' + Date.now() + '_' + bombId,
        tiles: explosionData.tiles,
        ticksRemaining: 10
      });

      // Spawn power-ups from destroyed blocks (30% chance)
      explosionData.destroyedBlocks.forEach(block => {
        if (Math.random() < 0.3) {
          const powerup = new PowerUp(block.x, block.y, randomPowerUpType());
          this.state.powerups.push(powerup);
          console.log(`⭐ Power-up spawned: ${powerup.type} at (${block.x}, ${block.y})`);
        }
      });

      // Damage players in explosion
      this.damagePlayersInTiles(explosionData.tiles);

      // Remove bomb and free player slot
      this.state.bombs.delete(bombId);
      const player = this.state.players.get(bomb.playerId);
      if (player) player.decrementBombs();
    });
  }

  updateExplosions() {
    this.state.explosions = this.state.explosions.filter(exp => {
      exp.ticksRemaining--;
      return exp.ticksRemaining > 0;
    });
  }

  checkPowerUpCollisions() {
    this.state.players.forEach(player => {
      if (!player.isAlive) return;

      // Find power-up at player position
      const powerupIndex = this.state.powerups.findIndex(
        p => p.x === player.x && p.y === player.y
      );

      if (powerupIndex !== -1) {
        const powerup = this.state.powerups[powerupIndex];

        // Apply power-up effect
        if (powerup.type === 'bomb') {
          player.powerups.bombCount++;
          console.log(`💣 ${player.name} picked up BOMB power-up! Count: ${player.powerups.bombCount}`);
        } else if (powerup.type === 'flame') {
          player.powerups.flameRange++;
          console.log(`🔥 ${player.name} picked up FLAME power-up! Range: ${player.powerups.flameRange}`);
        } else if (powerup.type === 'speed') {
          player.powerups.speed++;
          console.log(`⚡ ${player.name} picked up SPEED power-up! Speed: ${player.powerups.speed}`);
        }

        // Remove collected power-up
        this.state.powerups.splice(powerupIndex, 1);
      }
    });
  }

  damagePlayersInTiles(tiles) {
    this.state.players.forEach(player => {
      if (!player.isAlive) return;

      const hit = tiles.some(tile => tile.x === player.x && tile.y === player.y);

      if (hit) {
        const died = player.takeDamage();
        console.log(`💥 ${player.name} hit! Lives: ${player.lives}`);

        if (died) {
          console.log(`💀 ${player.name} died!`);
          this.emitPlayerDied(player);
        }
      }
    });
  }

  checkWinCondition() {
    const alivePlayers = Array.from(this.state.players.values()).filter(p => p.isAlive);

    if (alivePlayers.length === 1) {
      const winner = alivePlayers[0];
      this.endGame(winner);
    } else if (alivePlayers.length === 0) {
      this.endGame(null); // Draw
    }
  }

  endGame(winner) {
    console.log('🏁 Game Over! Winner:', winner?.name || 'Draw');

    this.state.running = false;
    this.gameLoop.stop();

    const playerStats = Array.from(this.state.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      score: p.lives * 50
    }));

    this.emitGameOver({
      winner: winner?.name || 'Draw',
      winnerId: winner?.id || null,
      players: playerStats
    });
  }

  handleMove(playerId, direction) {
    const player = this.state.players.get(playerId);
    if (!player || !player.isAlive) return;

    // Limit movement speed based on powerups (speed = max moves per tick)
    if (player.lastMoveTick !== this.state.tick) {
      player.lastMoveTick = this.state.tick;
      player.movesThisTick = 0;
    }

    if (player.movesThisTick >= player.powerups.speed) return;

    player.movesThisTick = (player.movesThisTick || 0) + 1;

    // Move player (returns array of visited tiles)
    const visitedTiles = player.move(direction, this.state.map);

    // Check for powerup collection on ALL visited tiles
    visitedTiles.forEach(tile => {
      const powerupIndex = this.state.powerups.findIndex(
        p => p.x === tile.x && p.y === tile.y
      );

      if (powerupIndex !== -1) {
        const powerup = this.state.powerups[powerupIndex];

        // Apply power-up effect
        if (powerup.type === 'bomb') {
          player.powerups.bombCount++;
          console.log(`💣 ${player.name} picked up BOMB power-up! Count: ${player.powerups.bombCount}`);
        } else if (powerup.type === 'flame') {
          player.powerups.flameRange++;
          console.log(`🔥 ${player.name} picked up FLAME power-up! Range: ${player.powerups.flameRange}`);
        } else if (powerup.type === 'speed') {
          player.powerups.speed++;
          console.log(`⚡ ${player.name} picked up SPEED power-up! Speed: ${player.powerups.speed}`);
        }

        // Remove collected power-up
        this.state.powerups.splice(powerupIndex, 1);
      }
    });
  }

  handleBomb(playerId) {
    const player = this.state.players.get(playerId);
    if (!player || !player.canPlaceBomb()) return;

    // Check if cell already has bomb
    const hasBomb = Array.from(this.state.bombs.values()).some(
      b => b.x === player.x && b.y === player.y
    );
    if (hasBomb) return;

    // Check if another player is on this cell
    const hasOtherPlayer = Array.from(this.state.players.values()).some(
      p => p.id !== playerId && p.isAlive && p.x === player.x && p.y === player.y
    );
    if (hasOtherPlayer) return;

    // Place bomb
    const bombId = 'bomb_' + this.state.bombIdCounter++;
    const bomb = new Bomb(bombId, player.x, player.y, playerId, player.powerups.flameRange);

    this.state.bombs.set(bombId, bomb);
    player.incrementBombs();

    console.log(`💣 ${player.name} placed bomb at (${player.x}, ${player.y})`);
  }

  emitGameState() {
    const elapsedSeconds = Math.floor((Date.now() - this.state.startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const timer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const snapshot = {
      tick: this.state.tick,
      timer: timer,
      players: Array.from(this.state.players.values()).map(p => p.toJSON()),
      bombs: Array.from(this.state.bombs.values()).map(b => b.toJSON()),
      explosions: this.state.explosions,
      blocks: this.getBlocks(),
      powerups: this.state.powerups.map(p => p.toJSON())
    };

    this.gameStateHandlers.forEach(fn => fn(snapshot));
  }

  getBlocks() {
    const blocks = [];
    const grid = this.state.map.getGrid();

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 2) {
          blocks.push({ x, y, destructible: true });
        }
      }
    }

    return blocks;
  }

  emitPlayerDied(player) {
    this.gameStateHandlers.forEach(fn => fn({
      type: 'PLAYER_DIED',
      playerId: player.id,
      playerName: player.name,
      remainingLives: player.lives
    }));
  }

  emitGameOver(data) {
    this.gameOverHandlers.forEach(fn => fn(data));
  }

  onGameState(handler) {
    this.gameStateHandlers.add(handler);
    return () => this.gameStateHandlers.delete(handler);
  }

  onGameOver(handler) {
    this.gameOverHandlers.add(handler);
    return () => this.gameOverHandlers.delete(handler);
  }

  handlePlayerDisconnect(playerId) {
    const player = this.state.players.get(playerId);
    if (player && this.state.running) {
      player.isAlive = false;
      player.lives = 0;
      console.log(`🔌 ${player.name} disconnected during game`);
    }
  }

  stopGame() {
    this.state.running = false;
    this.gameLoop.stop();
  }
}