/**
 * Sample questions for demo purposes
 * Import this in GameContext to pre-populate questions
 */

import { Question } from '../contexts/GameContext';

export const SAMPLE_QUESTIONS: Omit<Question, 'id'>[] = [
  // Round 1: General Questions
  {
    round: 1,
    question: 'What is the capital city of France?',
    answer: 'Paris',
  },
  {
    round: 1,
    question: 'In which year did World War II end?',
    answer: '1945',
  },
  {
    round: 1,
    question: 'What is the largest planet in our solar system?',
    answer: 'Jupiter',
  },
  {
    round: 1,
    question: 'Who painted the Mona Lisa?',
    answer: 'Leonardo da Vinci',
  },
  {
    round: 1,
    question: 'What is the chemical symbol for gold?',
    answer: 'Au',
  },

  // Round 2: Pass The Mic
  {
    round: 2,
    question: 'What is the smallest country in the world?',
    answer: 'Vatican City',
  },
  {
    round: 2,
    question: 'How many continents are there?',
    answer: '7',
  },
  {
    round: 2,
    question: 'What is the speed of light in vacuum (approximately)?',
    answer: '300,000 km/s',
  },
  {
    round: 2,
    question: 'Who wrote "Romeo and Juliet"?',
    answer: 'William Shakespeare',
  },
  {
    round: 2,
    question: 'What is the hardest natural substance on Earth?',
    answer: 'Diamond',
  },

  // Round 3: Buzzer Round
  {
    round: 3,
    question: 'What does CPU stand for in computers?',
    answer: 'Central Processing Unit',
  },
  {
    round: 3,
    question: 'In which country would you find the Great Barrier Reef?',
    answer: 'Australia',
  },
  {
    round: 3,
    question: 'What is the tallest mammal on Earth?',
    answer: 'Giraffe',
  },
  {
    round: 3,
    question: 'How many players are there in a soccer team?',
    answer: '11',
  },
  {
    round: 3,
    question: 'What is the currency of Japan?',
    answer: 'Yen',
  },

  // Round 4: Rapid Fire
  {
    round: 4,
    question: 'How many sides does a hexagon have?',
    answer: '6',
  },
  {
    round: 4,
    question: 'What color is a ruby?',
    answer: 'Red',
  },
  {
    round: 4,
    question: 'How many letters are in the English alphabet?',
    answer: '26',
  },
  {
    round: 4,
    question: 'What is 5 × 8?',
    answer: '40',
  },
  {
    round: 4,
    question: 'What animal says "meow"?',
    answer: 'Cat',
  },
];
