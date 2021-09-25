import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { RouteConstant } from '../Util/Constant/RouteConstant';

const CountDownTimer = ({ hoursMinSecs, isHour, onTimeOut }) => {
  const { hours = 0, minutes = 0, seconds = 60 } = hoursMinSecs;
  const [[hrs, mins, secs], setTime] = React.useState([
    hours,
    minutes,
    seconds,
  ]);
  const history = useHistory();

  const tick = async () => {
    if (hrs === 0 && mins === 0 && secs === 0) {
      await onTimeOut();
      history.push(RouteConstant.SECURE_HOME);
    } else if (mins === 0 && secs === 0) {
      setTime([hrs - 1, 59, 59]);
    } else if (secs === 0) {
      setTime([hrs, mins - 1, 59]);
    } else {
      setTime([hrs, mins, secs - 1]);
    }
  };

  React.useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);

    return () => {
      clearInterval(timerId);
    };
  });

  return isHour ? (
    <span>{`${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}</span>
  ) : (
    <strong>{`${secs.toString()} seconds`}</strong>
  );
};

export default CountDownTimer;
