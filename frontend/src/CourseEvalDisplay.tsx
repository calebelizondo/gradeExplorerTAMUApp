import { render } from "@testing-library/react";
import { Instructor } from "./Dashboard";
import { Chart } from "chart.js";
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

const questions_t: string[] = ["I understood what was expected of me", "This course helped me learn concepts or skills as stated in course objectives/outcomes", "In this course, I engaged in critical thinking and/or problem solving", "Please rate the organization of this course", "In this course, I learned to critically evaluate diverse ideas and perspectives", "Feedback in this course helped me learn"];
const answers_t: string[][] = [[ "No, I did not understand what was expected of me", "I partially understood what was expected of me", "Yes, I understood what was expected of me"],
    ["This course did not help me learn the concepts or skills", "This course only slightly helped me learn the concepts or skills", "This course only moderately helped me learn the concepts or skills", "This course definitely helped me learn the concepts or skills"], 
    ["Never", "Seldom", "Often", "Frequently"], 
    ["Not at all organized", "Slightly organized", "Moderately organized", "Very well organized"], 
    ["Not applicable", "Strongly disagree", "Disagree", "Neither", "Agree", "Strongly agree"],
    ["No feedback was provided", "Feedback provided was not at all helpful", "Feedback provided was only slightly helpful", "Feedback provided was moderately helpful", "Feedback provided was very helpful", "Feedback provided was extremely helpful"] ];

const Questions: Question[] = questions_t.map((question, i) => new Question(question, answers_t[i]));

const CourseEvalDisplay: React.FC<CourseEvalDisplayProps> = ( {instructors} ) => {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = Questions[currentQuestionIndex];
    const [bestInstructor, setBestInstructor] = useState<Instructor | null>(null);
    const [worstInstructor, setWorstInstructor] = useState<Instructor | null>(null);

    function nextQuestion() {
        if (currentQuestionIndex === Questions.length - 1) {
            setCurrentQuestionIndex(0);
            return;
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    function previousQuestion() {  
        if (currentQuestionIndex === 0) {  
            setCurrentQuestionIndex(Questions.length - 1);
            return;
        } else {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    useEffect(() => {
        // Render charts after the initial render
        renderCharts();
    }, [bestInstructor, worstInstructor]);

    
    useEffect(() => { 

        console.log("instructors", instructors);

        if (instructors != null){

            // store current best and worst instructors in temp variables to avoid triggering re-render
            var tempBestInstructor: Instructor = instructors?.[0];
            var tempWorstInstructor: Instructor = instructors?.[0];

            instructors.forEach((instructor) => {
                if (computeWeightedAverage(instructor) >= computeWeightedAverage(tempBestInstructor!)) {
                    tempBestInstructor = instructor;
                }
                else if (computeWeightedAverage(instructor) < computeWeightedAverage(tempWorstInstructor!)) {
                    tempWorstInstructor = instructor;
                }
            });
            
            // set best and worst instructors
            setBestInstructor(tempBestInstructor);
            setWorstInstructor(tempWorstInstructor);
        }
    }, [ currentQuestionIndex, instructors ]);

    // compute weighted average of responses
    function computeWeightedAverage(instructor: Instructor) {
        var sum = 0;
        var total = 0;

        var response_index = 0;

        // sum up weighted responses
        instructor.evalResponses?.[currentQuestionIndex]?.forEach(response => {
            sum += response * response_index; //higher index correlates to a more positive response
            total += response;
            response_index++;
        });
        return sum/total;
    }

    // render pie charts or clear if necassary
    function renderCharts() {
        if (bestInstructor && worstInstructor){
            renderPieChart('best-instructor-chart', bestInstructor);
            renderPieChart('worst-instructor-chart', worstInstructor);
        }
    }

    function renderPieChart(id: string, instructor: Instructor) {
        const responses = instructor.evalResponses?.[currentQuestionIndex];

        if (!responses) return;

        const data = {
            labels: currentQuestion.answer_choices,
            datasets: [{
                data: responses, 
                backgroundColor: [
                    'red',
                    'orange',
                    'yellow',
                    'green',
                    'blue',
                    'purple'
                ], 
            }]
        };
        
        const options = {
            reponsive: true, 
            maintainAspectRatio: false
        };

        const ctx = document.getElementById(id) as HTMLCanvasElement;
        
        if (ctx) {
            Chart.getChart(id)?.destroy();
            new Chart(ctx, {type: 'pie', data, options});
        }

    }

    return (

        <div>
            <h1>Course Evaluation responses</h1>
            <div>
                <h2> { currentQuestion.question } </h2>
                <button onClick={() => previousQuestion()}>prev</button>
                <button onClick={() => nextQuestion()}>next</button>
                <div>
                    <p>Best Instructor: {bestInstructor?.name}</p>
                    <div id="best-instructor-chart"></div>
                    <p>Worst Instructor: {worstInstructor?.name}</p>
                    <div id="worst-instructor-chart"></div>
                </div>
            </div>
        </div>
    );
};
  
  export default CourseEvalDisplay;