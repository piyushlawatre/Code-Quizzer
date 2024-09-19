import { useEffect } from "react";

export default function Timer({ dispatch, secondRemaining }) {
  const min = Math.floor(secondRemaining / 60);
  const second = secondRemaining % 60;

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <div className="timer">
      {formatTime(min)}:{formatTime(second)}
    </div>
  );
}
