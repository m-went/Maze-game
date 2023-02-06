function closeMenu(menuDiv) {
  menuDiv.classList.add('hidden');
}

function showMenu(menuDiv) {
  menuDiv.classList.remove('hidden');
}

function showGame() {
  makeNewMaze();
  gameDiv.classList.remove('hidden');
}

newGameBtn.addEventListener('click', () => {
  closeMenu(mainMenu);
  showGame();
  startTimer();
});

optionsBtn.addEventListener('click', () => {
  closeMenu(mainMenu);
  showMenu(optionsMenu);
});

highscoreBtn.addEventListener('click', () => {
  closeMenu(mainMenu);
  showMenu(highscoreMenu);
  loadHigscore();
});

//reload document to reset matter js
const resetMatter = () => {
  window.location.reload();
};

for (let btn of returnToMainMenuBtn) {
  btn.addEventListener('click', () => {
    closeMenu(optionsMenu);
    closeMenu(highscoreMenu);
    showMenu(mainMenu);
    resetTimer();
    document.querySelector('.winner').classList.add('hidden');
  });
}

for (let btn of resettingButtons) {
  btn.addEventListener('click', () => {
    //reset document
    resetMatter();
  });
}

optionsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  setDifficultyLevel(true);
});

function setHighScore(difficulty, points) {
  //check if there are any saved highscores
  loadHigscore();
  const newResult = parseInt(points.replace(':', ''));
  if (difficulty === 'easy') {
    const oldHighscore = parseInt(easyHighscore.innerText.replace(':', ''));
    if (easyHighscore.innerText === '0' || newResult < oldHighscore) {
      localStorage.setItem('easyHighscore', points);
    }
  } else if (difficulty === 'normal') {
    const oldHighscore = parseInt(normalHighscore.innerText.replace(':', ''));
    if (normalHighscore.innerText === '0' || newResult < oldHighscore) {
      localStorage.setItem('normalHighscore', points);
    }
  } else {
    const oldHighscore = parseInt(hardHighscore.innerText.replace(':', ''));
    if (hardHighscore.innerText === '0' || newResult < oldHighscore) {
      localStorage.setItem('hardHighscore', points);
    }
  }
}

function loadHigscore() {
  const easy = localStorage.getItem('easyHighscore');
  const normal = localStorage.getItem('normalHighscore');
  const hard = localStorage.getItem('hardHighscore');
  if (easy) {
    easyHighscore.innerText = easy;
  }
  if (normal) {
    normalHighscore.innerText = normal;
  }
  if (hard) {
    hardHighscore.innerText = hard;
  }
}
