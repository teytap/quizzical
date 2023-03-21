import React from "react";
export default function Welcome(props) {
  return (
    <div className="welcome--container">
      <h1>Quizzical</h1>
      <div className="slogan">Fun quiz game with five questions</div>
      {props.formHtml}

      <button className="start--quiz--btn" onClick={props.startQuiz}>
        Start Quiz
      </button>
    </div>
  );
}
