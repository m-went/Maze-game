//function to change difficulty
function setDifficultyLevel(isSubmittedFromMenu) {
  //run if difficulty is set in options menu
  if (isSubmittedFromMenu) {
    for (let level of difficultyLevelButtons) {
      if (level.checked) difficultyLevel = level.id;
    }
    //or run if its page reload
  } else {
    const savedDifficulty = localStorage.getItem('actualDifficulty');
    //if there is any saved difficulty, save it as acttual difficulty level, else check checked radio button
    if (savedDifficulty) {
      difficultyLevel = savedDifficulty;
      //check radio button in options menu
      for (let level of difficultyLevelButtons) {
        if (difficultyLevel === level.id) level.checked = true;
      }
    } else {
      for (let level of difficultyLevelButtons) {
        if (level.checked) difficultyLevel = level.id;
      }
    }
  }
  if (difficultyLevel === 'easy') {
    nrOfHorizontalCells = 6;
    nrOfVerticalCells = 5;
    pokeballScale = 0.5;
    pikachuScale = 0.06;
  } else if (difficultyLevel === 'normal') {
    nrOfHorizontalCells = 12;
    nrOfVerticalCells = 10;
    pokeballScale = 0.35;
    pikachuScale = 0.05;
  } else {
    nrOfHorizontalCells = 24;
    nrOfVerticalCells = 20;
    pokeballScale = 0.25;
    pikachuScale = 0.025;
  }
  cellWidth = width / nrOfHorizontalCells;
  cellHeight = height / nrOfVerticalCells;
  localStorage.setItem('actualDifficulty', difficultyLevel);
}

setDifficultyLevel();

function makeNewMaze() {
  //delete old maze div
  gameField.remove();
  //make new div for new maze
  const newDiv = document.createElement('div');
  newDiv.classList.add('gameField-visible');
  newDiv.id = 'gameField';
  gameDiv.appendChild(newDiv);

  gameField = newDiv;
  //initialize maze again
  makeMaze();
}
