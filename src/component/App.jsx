import { useEffect, useReducer, useState } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import RestartButton from "./Footer";
import Footer from "./Footer";
import Timer from "./Timer";

const initialState = {
  status: "loading", // "loading" | "error" | "ready" | "start" | "finished"
  questions: [],
  answer: null,
  index: 0,
  points: 0,
  secondRemaining: 0,
};

const SEC_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        status: "start",
        secondRemaining: state.questions.length * SEC_PER_QUESTION,
      };

    case "newAnswer":
      const question = state.questions[state.index];
      const hasCorrectlyAnswered = action.payload === question.correctOption;
      return {
        ...state,
        answer: action.payload,
        points: hasCorrectlyAnswered
          ? state.points + question.points
          : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        answer: null,
        index: state.index + 1,
      };

    case "finish":
      return {
        ...state,
        status: "finish",
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? "finish" : state.status,
      };
    default:
      throw new Error("Action Unknown");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { status, questions, index, answer, points, secondRemaining } = state;
  const numQuestions = questions.length;

  const totalPoints = questions.reduce((acc, curr) => {
    acc = acc + curr.points;
    return acc;
    s;
  }, 0);

  const maxTimer = useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await fetch("http://localhost:3000/questions");
        const questions = await res.json();
        dispatch({ type: "dataReceived", payload: questions });
      } catch (error) {
        dispatch({ type: "dataFailed" });
      }
    }
    fetchQuestion();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "start" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              totalPoints={totalPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <Timer dispatch={dispatch} secondRemaining={secondRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finish" && (
          <FinishScreen
            points={points}
            totalPoints={totalPoints}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
