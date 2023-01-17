const { World, Engine, Runner, Bodies, Render, Body, Events } = Matter;

const width = window.innerWidth;
const height = window.innerHeight;
document.body.style.overflow = "hidden";
const nrOfHorizontalCells = 24;
const nrOfVerticalCells = 20;

const cellWidth = width / nrOfHorizontalCells;
const cellHeight = height / nrOfVerticalCells;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];
World.add(world, walls);

//maze grid
const grid = Array(nrOfVerticalCells)
  .fill(null)
  .map(() => Array(nrOfHorizontalCells).fill(false));

const horizontalWalls = Array(nrOfVerticalCells - 1)
  .fill(null)
  .map(() => Array(nrOfHorizontalCells).fill(false));
const verticalWalls = Array(nrOfVerticalCells)
  .fill(null)
  .map(() => Array(nrOfHorizontalCells - 1).fill(false));

const startRow = Math.floor(Math.random() * nrOfVerticalCells);
const startColumn = Math.floor(Math.random() * nrOfHorizontalCells);

//making maze algoritm
const stepThroughCell = (row, column) => {
  if (grid[row][column]) return;
  //mark as visited
  grid[row][column] = true;

  //make neighbours list
  const neighbours = [
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ];

  //choose valid neighbours to pass
  const validNeighbours = [];
  for (let neighbour of neighbours) {
    const [nextRow, nextColumn, direction] = neighbour;
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
    if (chosenNeighbour[2] === "up") {
      horizontalWalls[row - 1][column] = true;
    } else if (chosenNeighbour[2] === "down") {
      horizontalWalls[row][column] = true;
    } else if (chosenNeighbour[2] === "right") {
      verticalWalls[row][column] = true;
    } else if (chosenNeighbour[2] === "left") {
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
  return Bodies.rectangle(
    cellWidth / 2 + cellWidth * column,
    cellHeight * row,
    cellWidth,
    2,
    { isStatic: true, label: "wall", render: { fillStyle: "red" } }
  );
};
const verticalWallPart = (row, column) => {
  return Bodies.rectangle(
    cellWidth * column,
    cellHeight / 2 + cellHeight * row,
    2,
    cellHeight,
    { isStatic: true, label: "wall", render: { fillStyle: "red" } }
  );
};

//ball
const ballRadious = Math.min(cellHeight / 4, cellWidth / 4);
const ball = Bodies.circle(cellWidth / 2, cellHeight / 2, ballRadious, {
  label: "ball",
  render: { fillStyle: "blue" },
});
World.add(world, ball);

//square
const square = Bodies.rectangle(
  width - cellWidth / 2,
  height - cellHeight / 2,
  cellWidth * 0.7,
  cellHeight * 0.7,
  { isStatic: true, label: "goal", render: { fillStyle: "green" } }
);
World.add(world, square);

document.body.addEventListener("keydown", (e) => {
  const { x, y } = ball.velocity;
  const limit = 5;
  if (e.key === "w") {
    Body.setVelocity(ball, { x, y: Math.max(-limit, y - 5) });
  } else if (e.key === "s") {
    Body.setVelocity(ball, { x, y: Math.min(limit, y + 5) });
  } else if (e.key === "a") {
    Body.setVelocity(ball, { x: Math.max(-limit, x - 5), y });
  } else if (e.key === "d") {
    Body.setVelocity(ball, { x: Math.min(limit, x + 5), y });
  }
});

//Winning condition
Events.on(engine, "collisionStart", (e) => {
  e.pairs.forEach((collision) => {
    if (
      collision.bodyA.label === ("ball" || "goal") &&
      collision.bodyB.label === ("goal" || "label")
    ) {
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
      document.querySelector(".winner").classList.remove("hidden");
    }
  });
});
stepThroughCell(0, 0);
makingWalls(horizontalWalls, verticalWalls);
