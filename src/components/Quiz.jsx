import React from "react";
import Answers from "./Answers";

export default function Quiz(props) {
  const answerElements = props.allAnswers.map((answer) => (
    <Answers
      key={answer.id}
      choice={answer.choice}
      isSelected={answer.isSelected}
      isCorrect={answer.isCorrect}
      score={props.score}
      selectAnswer={props.selectAnswer}
    />
  ));
  return (
    <div className="quiz--container">
      <div
        className="category-text"
        style={{ opacity: "0.5", fontStyle: "italic" }}
      >
        {props.category}
      </div>
      <h3 id="form-prompt">{props.question}</h3>
      <div className="answers-div">{answerElements}</div>
      <hr />
    </div>
  );
}
