import React from "react";
export default function Welcome(props) {
  return (
    <div className="welcome--container">
      <h1>Quizzical</h1>
      <div>Multiple questions about general knowledge</div>
      <button className="start--quiz--btn" onClick={props.startQuiz}>
        Start Quiz
      </button>
    </div>
  );
}
