import React from "react";
export default function Answers(props) {
  let styles;

  // Before you start the Quiz. No anwer is selected.
  if (props.score === null) {
    styles = {
      backgroundColor: props.isSelected ? "#D6DBF5" : "transparent",
      border: "1px solid #D6DBF5",
    };
  }
  // After clicked the Check answer button.
  else {
    if (props.isCorrect) {
      styles = { backgroundColor: "#94D7A2", border: "1px solid #94D7A2" };
    } else if (!props.isCorrect && props.isSelected) {
      styles = { backgroundColor: "#f6dadc", border: "1px solid #f6dadc" };
    }
  }
  return (
    <div
      className="answers-container"
      onClick={props.selectAnswer}
      style={styles}
    >
      {props.choice}
    </div>
  );
}
