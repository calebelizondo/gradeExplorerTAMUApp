import React from "react";
import CustomPieChart from "./Piechart";
import { Instructor } from "./Dashboard";
import { useState, useEffect } from "react";

interface CourseEvalDisplayProps {
  instructors: Instructor[] | null;
}

class Question {
  question: string;
  answer_choices: string[];

  constructor(question: string, answer_choices: string[]) {
    this.question = question;
    this.answer_choices = answer_choices;
  }
}

const questions_t: string[] = [
  "I understood what was expected of me",
  "This course helped me learn concepts or skills as stated in course objectives/outcomes",
  "In this course, I engaged in critical thinking and/or problem solving",
  "Please rate the organization of this course",
  "In this course, I learned to critically evaluate diverse ideas and perspectives",
  "Feedback in this course helped me learn",
];
const answers_t: string[][] = [
  ["No, I did not understand what was expected of me", "I partially understood what was expected of me", "Yes, I understood what was expected of me"],
  [
    "This course did not help me learn the concepts or skills",
    "This course only slightly helped me learn the concepts or skills",
    "This course only moderately helped me learn the concepts or skills",
    "This course definitely helped me learn the concepts or skills",
  ],
  ["Never", "Seldom", "Often", "Frequently"],
  ["Not at all organized", "Slightly organized", "Moderately organized", "Very well organized"],
  ["Not applicable", "Strongly disagree", "Disagree", "Neither", "Agree", "Strongly agree"],
  [
    "No feedback was provided",
    "Feedback provided was not at all helpful",
    "Feedback provided was only slightly helpful",
    "Feedback provided was moderately helpful",
    "Feedback provided was very helpful",
    "Feedback provided was extremely helpful",
  ],
];

const Questions: Question[] = questions_t.map((question, i) => new Question(question, answers_t[i]));

const CourseEvalDisplay: React.FC<CourseEvalDisplayProps> = ({ instructors }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = Questions[currentQuestionIndex];
  const [bestInstructor, setBestInstructor] = useState<Instructor | null>(null);
  const [worstInstructor, setWorstInstructor] = useState<Instructor | null>(null);

  function nextQuestion() {
    if (currentQuestionIndex === Questions.length - 1) {
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex === 0) {
      setCurrentQuestionIndex(Questions.length - 1);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  useEffect(() => {
    if (instructors != null) {
      var tempBestInstructor: Instructor = instructors?.[0];
      var tempWorstInstructor: Instructor = instructors?.[0];

      instructors.forEach((instructor) => {
        if (computeWeightedAverage(instructor) >= computeWeightedAverage(tempBestInstructor!)) {
          tempBestInstructor = instructor;
        } else if (computeWeightedAverage(instructor) < computeWeightedAverage(tempWorstInstructor!)) {
          tempWorstInstructor = instructor;
        }
      });

      setBestInstructor(tempBestInstructor);
      setWorstInstructor(tempWorstInstructor);
    }
  }, [currentQuestionIndex, instructors]);

  function computeWeightedAverage(instructor: Instructor) {
    var sum = 0;
    var total = 0;

    var response_index = 0;

    instructor.evalResponses?.[currentQuestionIndex]?.forEach((response) => {
      sum += response * response_index;
      total += response;
      response_index++;
    });
    return sum / total;
  }

  return (
    <div>
      <h1>Course Evaluation responses</h1>
      <div className="question-container">
        <h2>{currentQuestion.question}</h2>
        <div className="best-prof-chart-container">
          <CustomPieChart data={bestInstructor?.evalResponses?.[currentQuestionIndex]} labels={answers_t[currentQuestionIndex]} id="best-instructor-chart" />
          <p className="small-text">Best Instructor: {bestInstructor?.name}</p>
        </div>
        <div className="worst-prof-container">
          <CustomPieChart data={worstInstructor?.evalResponses?.[currentQuestionIndex]} labels={answers_t[currentQuestionIndex]} id="worst-instructor-chart" />
          <p className="small-text">Worst Instructor: {worstInstructor?.name}</p>
        </div>
        <div className="question-navigation">
          <button className="custom-button" onClick={() => setCurrentQuestionIndex((prev) => (prev === 0 ? Questions.length - 1 : prev - 1))}>
            Previous
          </button>
          <button className="custom-button" onClick={() => setCurrentQuestionIndex((prev) => (prev === Questions.length - 1 ? 0 : prev + 1))}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseEvalDisplay;
