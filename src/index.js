import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import questionsData from './questions_with_answers.js';

// Shuffle the questions once at the start
function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const questions = shuffleArray(questionsData);

let currentQuestion = 0;
let score = 0;

function loadQuestion() {
  const q = questions[currentQuestion];
  document.getElementById('question').textContent = q.question;

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  q.options.forEach((option) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.className = 'option-button';
    btn.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(btn);
  });
}

function checkAnswer(selectedOption) {
  const q = questions[currentQuestion];
  const isCorrect = selectedOption === q.answer;
  if (isCorrect) score++;

  const feedback = document.createElement('div');
  feedback.className = 'feedback';
  feedback.innerHTML = `
    <p><strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect.'}</strong></p>
    <p><em>Explanation:</em> ${q.explanation}</p>
  `;

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  optionsContainer.appendChild(feedback);

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }, 3000); // Wait 3 seconds before moving to next question
}

function showResults() {
  const quizContainer = document.getElementById('quiz');
  quizContainer.innerHTML = `
    <h2>🎉 Quiz Completed!</h2>
    <p>Your score: <strong>${score}</strong> out of <strong>${questions.length}</strong></p>
    <p>${score >= questions.length / 2 ? 'Great job!' : 'Keep practicing!'}</p>
    <button onclick="restartQuiz()">Restart Quiz</button>
  `;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  const reshuffled = shuffleArray(questionsData);
  questions.splice(0, questions.length, ...reshuffled);
  document.getElementById('quiz').innerHTML = `
    <h1 id="question"></h1>
    <div id="options"></div>
  `;
  loadQuestion();
}

window.onload = loadQuestion;
