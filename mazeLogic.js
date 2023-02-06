function makeMaze() {
  //initialize matter.js
  engine = Engine.create();
  engine.world.gravity.y = 0;
  world = engine.world;
  render = Render.create({
    element: gameField,
    engine: engine,
    options: {
      wireframes: false,
      width,
      height,
      background: 'transparent',
    },
  });
  Render.run(render);
  runner = Runner.create();
  Runner.run(runner, engine);

  //walls
  const walls = [
    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
  ];
  World.add(world, walls);

  //maze grid
  function createMaze() {
    const grid = Array(nrOfVerticalCells)
      .fill(null)
      .map(() => Array(nrOfHorizontalCells).fill(false));

    const horizontalWalls = Array(nrOfVerticalCells - 1)
      .fill(null)
      .map(() => Array(nrOfHorizontalCells).fill(false));
    const verticalWalls = Array(nrOfVerticalCells)
      .fill(null)
      .map(() => Array(nrOfHorizontalCells - 1).fill(false));

    //making maze algoritm
    const stepThroughCell = (row, column) => {
      if (grid[row][column]) return;
      //mark as visited
      grid[row][column] = true;

      //make neighbours list
      const neighbours = [
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left'],
      ];

      //choose valid neighbours to pass
      const validNeighbours = [];
      for (let neighbour of neighbours) {
        const [nextRow, nextColumn] = neighbour;
        if (
          nextRow < 0 ||
          nextRow >= nrOfVerticalCells ||
          nextColumn < 0 ||
          nextColumn >= nrOfHorizontalCells ||
          grid[nextRow][nextColumn] === true
        ) {
          continue;
        } else {
          validNeighbours.push(neighbour);
        }
      }

      //end loop if there is no more cells
      if (validNeighbours.length === 0) return;

      //shuffle valid naighbours

      const shuffle = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
          const temp = arr[i];
          const randIndex = Math.floor(Math.random() * arr.length);
          arr[i] = arr[randIndex];
          arr[randIndex] = temp;
        }
      };
      shuffle(validNeighbours);

      //make a wall between actual cell and chosen cell
      for (let chosenNeighbour of validNeighbours) {
        if (grid[chosenNeighbour[0]][chosenNeighbour[1]]) continue;
        //updating wall arrays
        if (chosenNeighbour[2] === 'up') {
          horizontalWalls[row - 1][column] = true;
        } else if (chosenNeighbour[2] === 'down') {
          horizontalWalls[row][column] = true;
        } else if (chosenNeighbour[2] === 'right') {
          verticalWalls[row][column] = true;
        } else if (chosenNeighbour[2] === 'left') {
          verticalWalls[row][column - 1] = true;
        }
        //step to that cell
        stepThroughCell(chosenNeighbour[0], chosenNeighbour[1]);
      }
    };

    function makingWalls(horizontalWalls, verticalWalls) {
      for (let i = 0; i < horizontalWalls.length; i++) {
        for (let j = 0; j < horizontalWalls[i].length; j++) {
          if (!horizontalWalls[i][j]) {
            World.add(world, horizontalWallPart(i + 1, j));
          }
        }
      }
      for (let i = 0; i < verticalWalls.length; i++) {
        for (let j = 0; j < verticalWalls[i].length; j++) {
          if (!verticalWalls[i][j]) {
            World.add(world, verticalWallPart(i, j + 1));
          }
        }
      }
    }
    const horizontalWallPart = (row, column) => {
      return Bodies.rectangle(cellWidth / 2 + cellWidth * column, cellHeight * row, cellWidth, 5, {
        isStatic: true,
        label: 'wall',
        render: { fillStyle: 'black' },
      });
    };
    const verticalWallPart = (row, column) => {
      return Bodies.rectangle(cellWidth * column, cellHeight / 2 + cellHeight * row, 5, cellHeight, {
        isStatic: true,
        label: 'wall',
        render: { fillStyle: 'black' },
      });
    };

    //pokeball
    const pokeballRadious = Math.min(cellHeight / 4, cellWidth / 4);

    pokeball = Bodies.circle(cellWidth / 2, cellHeight / 2, pokeballRadious, {
      label: 'pokeball',
      render: {
        sprite: {
          texture: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg',
          yScale: pokeballScale,
          xScale: pokeballScale,
        },
      },
    });
    World.add(world, pokeball);

    //pikachu
    const pikachu = Bodies.rectangle(width - cellWidth / 2, height - cellHeight / 2, cellWidth, cellHeight, {
      isStatic: true,
      label: 'pikachu',
      render: {
        sprite: {
          texture: 'file:///C:/Users/oktaw/Downloads/cdnlogo.com_pokemon%20(1).svg',
          yScale: pikachuScale,
          xScale: pikachuScale,
        },
      },
    });
    World.add(world, pikachu);

    stepThroughCell(0, 0);
    makingWalls(horizontalWalls, verticalWalls);
  }

  const steerPokeball = (e) => {
    const { x, y } = pokeball.velocity;
    const limit = 3.5;
    if (e.key === 'w') {
      Body.setVelocity(pokeball, { x, y: Math.max(-limit, y - 3.5) });
    } else if (e.key === 's') {
      Body.setVelocity(pokeball, { x, y: Math.min(limit, y + 3.5) });
    } else if (e.key === 'a') {
      Body.setVelocity(pokeball, { x: Math.max(-limit, x - 3.5), y });
    } else if (e.key === 'd') {
      Body.setVelocity(pokeball, { x: Math.min(limit, x + 3.5), y });
    }
  };

  //Winning condition
  Events.on(engine, 'collisionStart', (e) => {
    e.pairs.forEach((collision) => {
      if (collision.bodyA.label === ('pokeball' || 'pikachu') && collision.bodyB.label === ('pikachu' || 'pokeball')) {
        world.gravity.y = 1;
        world.bodies.forEach((body) => {
          if (body.label === 'wall') {
            Body.setStatic(body, false);
          }
          if (body.label === 'pokeball') {
            Body.setStatic(body, true);
          }
        });
        document.querySelector('.winner').classList.remove('hidden');
        const score = stopTimer();
        setHighScore(difficultyLevel, score);
      }
    });
  });
  createMaze();
  document.body.addEventListener('keydown', steerPokeball);
}
