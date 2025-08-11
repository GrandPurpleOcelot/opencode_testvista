import React, { useEffect, useRef, useState } from 'react';

const WIDTH = 400;
const HEIGHT = 600;
const BIRD_SIZE = 32;
const GRAVITY = 0.5;
const JUMP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 2;

type Pipe = { x: number; gapY: number };

const getRandomGapY = () => Math.floor(Math.random() * (HEIGHT - PIPE_GAP - 100)) + 50;

const FlappyBird: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  // Game state
  const birdY = useRef(HEIGHT / 2);
  const velocity = useRef(0);
  const pipes = useRef<Pipe[]>([
    { x: WIDTH + 100, gapY: getRandomGapY() },
    { x: WIDTH + 100 + 200, gapY: getRandomGapY() },
  ]);

  // Game loop
  useEffect(() => {
    let animation: number;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    function draw() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      // Draw background
      ctx.fillStyle = '#70c5ce';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      // Draw pipes
      ctx.fillStyle = '#43a047';
      pipes.current.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, HEIGHT - pipe.gapY - PIPE_GAP);
      });
      // Draw bird
      ctx.fillStyle = '#ffc107';
      ctx.beginPath();
      ctx.arc(80, birdY.current, BIRD_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      // Draw score
      ctx.fillStyle = '#fff';
      ctx.font = '32px sans-serif';
      ctx.fillText(score.toString(), WIDTH / 2 - 10, 50);
    }

    function update() {
      if (!started || gameOver) return;
      // Bird physics
      velocity.current += GRAVITY;
      birdY.current += velocity.current;
      // Pipes movement
      pipes.current.forEach(pipe => { pipe.x -= PIPE_SPEED; });
      // Add new pipe
      if (pipes.current[0].x < -PIPE_WIDTH) {
        pipes.current.shift();
        pipes.current.push({ x: WIDTH, gapY: getRandomGapY() });
        setScore(s => s + 1);
      }
      // Collision
      pipes.current.forEach(pipe => {
        if (80 + BIRD_SIZE / 2 > pipe.x && 80 - BIRD_SIZE / 2 < pipe.x + PIPE_WIDTH) {
          if (birdY.current - BIRD_SIZE / 2 < pipe.gapY || birdY.current + BIRD_SIZE / 2 > pipe.gapY + PIPE_GAP) {
            setGameOver(true);
          }
        }
      });
      // Ground/ceiling collision
      if (birdY.current + BIRD_SIZE / 2 > HEIGHT || birdY.current - BIRD_SIZE / 2 < 0) {
        setGameOver(true);
      }
    }

    function loop() {
      update();
      draw();
      if (!gameOver) animation = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(animation);
  }, [gameOver, started]);

  // Controls
  useEffect(() => {
    function handleJump(e: KeyboardEvent | MouseEvent) {
      if (gameOver) return;
      if (!started) setStarted(true);
      velocity.current = JUMP;
    }
    window.addEventListener('keydown', handleJump);
    window.addEventListener('mousedown', handleJump);
    return () => {
      window.removeEventListener('keydown', handleJump);
      window.removeEventListener('mousedown', handleJump);
    };
  }, [gameOver, started]);

  // Restart
  function restart() {
    setScore(0);
    setGameOver(false);
    setStarted(false);
    birdY.current = HEIGHT / 2;
    velocity.current = 0;
    pipes.current = [
      { x: WIDTH + 100, gapY: getRandomGapY() },
      { x: WIDTH + 100 + 200, gapY: getRandomGapY() },
    ];
  }

  return (
    <div>
      <h2>Flappy Bird</h2>
      <p>Press space or click to jump. Score: {score}</p>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ background: '#70c5ce', display: 'block', margin: '0 auto' }} />
      {gameOver && (
        <div>
          <h3>Game Over!</h3>
          <button onClick={restart}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default FlappyBird;

