import React from "react";
export default function Welcome() {
  function startQuiz() {
    console.log("start quiz");
  }
  return (
    <div className="welcome">
      <h1>Quizzical</h1>
      <div>Multiple questions about general knowledge</div>
      <button onClick={startQuiz}>Start Quiz</button>
    </div>
  );
}
