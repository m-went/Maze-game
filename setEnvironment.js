//get all elements
const newGameBtn = document.getElementById('new-game');
const optionsBtn = document.getElementById('options');
const highscoreBtn = document.getElementById('highscore');
const mainMenu = document.getElementById('main-menu');
const optionsMenu = document.getElementById('options-menu');
const highscoreMenu = document.getElementById('highscore-menu');
const returnToMainMenuBtn = document.getElementsByClassName('return-button');
const optionsForm = document.getElementById('options-form');
const difficultyLevelButtons = document.querySelectorAll('input[type=radio]');
const gameDiv = document.getElementById('maze-game');
const easyHighscore = document.getElementById('easy-highscore');
const normalHighscore = document.getElementById('normal-highscore');
const hardHighscore = document.getElementById('hard-highscore');
const resettingButtons = document.querySelectorAll('.reset-maze');

//set div to insert maze
let gameField = document.getElementById('gameField');

//define width and height based on displaying device
const width = window.innerWidth - 10;
const height = window.innerHeight - 75;

// set variables to change with difficulty levels
let difficultyLevel;
let nrOfHorizontalCells;
let nrOfVerticalCells;
let cellWidth;
let cellHeight;
let pokeball;
let pokeballScale;
let pikachuScale;

//Matter.js variables
const { World, Engine, Runner, Bodies, Render, Body, Events } = Matter;
let world;
let engine;
let render;
let runner;
