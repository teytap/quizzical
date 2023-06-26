import { useState, useEffect } from "react";
import Welcome from "./components/Welcome";
import Quiz from "./components/Quiz";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { categories, difficulties } from "./data";

import "./App.css";

function App() {
  const [start, setStart] = useState(false);
  const [form, setForm] = useState({
    category: "",
    difficulty: "",
  });
  const { category, difficulty } = form;
  const [apiUrl, setApiUrl] = useState("https://opentdb.com/api.php?amount=5");
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setApiUrl(
      `https://opentdb.com/api.php?amount=5${
        category ? `&category=${category}` : ""
      }${difficulty ? `&difficulty=${difficulty}` : ""}`
    );
  }, [form]);

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
      //added id, 4 answers randomly, and a decoded question
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
  }, [play, apiUrl]); // questions change when apiUrl changes

  function startQuiz() {
    setStart((prevStart) => !prevStart);
  }
  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  function checkAnswers() {
    let count = 0;
    questions.forEach((q) => {
      q.allAnswers.forEach((ans) => {
        if (ans.isSelected && ans.isCorrect) {
          count = count + 1;
        }
      });
    });

    setScore(count);
  }

  function selectAnswer(event, questionId) {
    //changes isSelected to true
    const selectedAnswer = event.target.innerHTML;

    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        const updatedAnswers = q.allAnswers.map((ans) => {
          return { ...ans, isSelected: ans.choice === selectedAnswer };
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
  //change buttons display after submit quiz
  const checkAnswersStyle = { display: score === null ? "block" : "none" };
  const playAgainStyle = { display: score === null ? "none" : "block" };

  //a form in welcome as props:to choose category and difficulty came from data.js
  const formHtml = (
    <form>
      <label htmlFor="difficulty">Set difficulty</label>
      <select
        id="difficulty"
        value={difficulty}
        onChange={handleChange}
        name="difficulty"
      >
        {" "}
        {difficulties.map(({ difficulty, value }) => (
          <option value={value} key={nanoid()}>
            {difficulty}
          </option>
        ))}
      </select>

      <label htmlFor="category">Choose a topic</label>

      <select
        id="category"
        value={category}
        onChange={handleChange}
        name="category"
      >
        {categories.map(({ topic, value }) => (
          <option value={value} key={nanoid()}>
            {topic}
          </option>
        ))}
      </select>
    </form>
  );

  return (
    <div className="App">
      <div style={welcomeStyle}>
        <Welcome startQuiz={startQuiz} formHtml={formHtml} />
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
        {score !== null && (
          <button
            className="check--btn"
            type="submit"
            onClick={() => {
              window.location.reload();
            }}
            style={playAgainStyle}
          >
            Change Quiz
          </button>
        )}
        <footer>
          API from{" "}
          <a href="https://opentdb.com/" target="_blank" rel="noreferrer">
            opentdb
          </a>
        </footer>
      </div>

      {score > 3 && <Confetti />}
    </div>
  );
}

export default App;
