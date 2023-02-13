import { useState, useEffect } from "react";
import Welcome from "./components/Welcome";
import Quiz from "./components/Quiz";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

import "./App.css";

function App() {
  const [start, setStart] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(null);
  const [play, setPlay] = useState(false);

  //const [fiveQuestions, setFiveQuestions] = useState([]);
  const apiUrl =
    "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple";
  //const apiUrl =
  //("https://opentdb.com/api.php?amount=5&category=11&difficulty=easy&type=multiple");

  // decode function fixes unreadable html
  function decode(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  useEffect(() => {
    async function getQuestions() {
      const response = await fetch(apiUrl);
      const data = await response.json();

      //add id, 4 answer options in a random order, and a decoded question
      const newQuizData = data.results.map((que) => {
        const question = decode(que.question);
        //mix answer array
        let allAnswers = [];
        allAnswers.push(que.incorrect_answers);
        allAnswers.push(que.correct_answer);

        allAnswers = allAnswers.flat().sort(() => Math.random() - 0.5);
        allAnswers = allAnswers.map((ans) => ({
          id: nanoid(),
          choice: decode(ans),
          isSelected: false,
          isCorrect: ans === que.correct_answer ? true : false,
        }));

        return {
          ...que,
          question: question,
          id: nanoid(),
          allAnswers: allAnswers,
        };
      });

      setQuestions(() => newQuizData);
    }
    getQuestions();
  }, [play]);

  function startQuiz() {
    setStart((prevStart) => !prevStart);
  }
  function checkAnswers() {
    let count = 0;
    questions.forEach((q) => {
      q.allAnswers.forEach((ans) => {
        if (ans.isSelected && ans.isCorrect) {
          count = count + 1;
        }
      });
    });
    console.log(count);
    setScore(count);
  }
  function selectAnswer(event, questionId) {
    //isSelected -> true
    const selectedAnswer = event.target.innerHTML;

    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        const updatedAnswers = q.allAnswers.map((ans) => {
          if (ans.choice === selectedAnswer) {
            return { ...ans, isSelected: true };
          } else {
            return { ...ans, isSelected: false };
          }
        });
        return { ...q, allAnswers: updatedAnswers };
      } else {
        return { ...q };
      }
    });
    setQuestions(updatedQuestions);
  }
  function playAgain() {
    setPlay((prevPlay) => !prevPlay);
    setScore(null);
  }
  const fiveQuestions = questions.map((q) => (
    <Quiz
      key={q.id}
      category={q.category}
      question={q.question}
      allAnswers={q.allAnswers}
      score={score}
      selectAnswer={() => selectAnswer(event, q.id)}
    />
  ));
  const welcomeStyle = { display: start ? "none" : "block" };
  const quizStyle = { display: start ? "block" : "none" };
  const checkAnswersStyle = { display: score === null ? "block" : "none" };
  const playAgainStyle = { display: score === null ? "none" : "block" };

  return (
    <div className="App">
      <div style={welcomeStyle}>
        <Welcome startQuiz={startQuiz} />
      </div>
      <div style={quizStyle}>
        <h1>Quizzical</h1>
        {fiveQuestions}
        <button
          className="check--btn"
          type="submit"
          onClick={checkAnswers}
          style={checkAnswersStyle}
        >
          Check Answers
        </button>
        <h3 className="result-text">
          {score !== null && `You scored ${score}/5 correct answers`}
        </h3>
        <button
          className="check--btn"
          type="submit"
          onClick={playAgain}
          style={playAgainStyle}
        >
          Play Again
        </button>
      </div>
      {score > 4 && <Confetti />}
    </div>
  );
}

export default App;
