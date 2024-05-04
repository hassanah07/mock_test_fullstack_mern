import React from "react";
import Countdown from "react-countdown";

const CountDownTimer = ({ submitExam }) => {
  return <Countdown date={Date.now() + 900000} onComplete={submitExam} />;
};

export default CountDownTimer;
