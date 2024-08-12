import { useState, useEffect } from 'react';import './Dashboard.css';
import CourseSelect from './CourseSelect';
import InstructorSelect from './InstructorSelect';
import GradeDistDisplay from './GradeDistDisplay';
import CourseEvalDisplay from './CourseEvalDisplay';

export class Course {
  subjectCode: string;
  courseNumber: string;

  constructor(subjectCode: string, courseNumber: string) {
    this.subjectCode = subjectCode;
    this.courseNumber = courseNumber;
  }
}

export class Instructor {
  name: string;
  GPA: number;
  evalResponses: number[][] | null;

  gradeDistribution: {
    a: number;
    b: number;
    c: number;
    d: number;
    f: number;
  };

  constructor(name: string, GPA: number, gradeDistribution: { a: number; b: number; c: number; d: number; f: number; }, 
      evalResponses: number[][] | null = null) {
      this.GPA = GPA;
      this.gradeDistribution = gradeDistribution;
      this.name = name;
      this.evalResponses = evalResponses;
  }
}

const Dashboard = () => {
  // The course selected by the user
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // All instructors for the selected course
  const [instructors, setInstructors] = useState<Instructor[] | null>(null);
  // The instructors selected by the user
  const [selectedInstructors, setSelectedInstructors] = useState<Instructor[] | null>(null);
  // The instructors are being fetched (used to trigger loading animation in instructor selector)
  const [isFetching, setIsFetching] = useState(false);

  const sendHeight = () => {
    const height = document.documentElement.scrollHeight;
    window.parent.postMessage({ type: 'SET_HEIGHT', height }, '*');
  };

  const sendWidth = () => {
    const width = document.documentElement.scrollWidth;
    window.parent.postMessage({ type: 'SET_WIDTH', width}, '*');
  };

  useEffect(() => {
    sendHeight();
    sendWidth();

    const resizeObserver = new ResizeObserver(() => {
      sendHeight();
    });

    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  //Fetch the instructors for the selected course
  useEffect(() => {
    if (selectedCourse != null) {

      // activate loading animation in selector list
      setIsFetching(true);
      //reset the instructors to clear any previous selections
      setInstructors(null);
      setSelectedInstructors(null);

      fetch(`https://gradedashboardtamu.onrender.com/get_grades/${selectedCourse?.subjectCode}/${selectedCourse?.courseNumber}`)
        .then(response => response.json())
        .then(data => {
          const formattedInstructors: Instructor[] = data.map((instructorData: any) => {
            // Create new Instructor object and push to the list
            return new Instructor(instructorData.professor, instructorData.average_gpa, instructorData.grade_distribution);
          });

          // Update state with formatted instructors
          setInstructors(formattedInstructors);
          setIsFetching(false);
        })
        .catch(error => console.error('Error fetching instructors:', error));
    }else { // If no course is selected, clear the instructors
      setInstructors(null);
      setSelectedInstructors(null);
    }
  }, [selectedCourse]); 

  async function addInstructor(instructor: Instructor) {
    try {
      // Fetch eval responses before adding instructor
      const response = await fetch(`https://gradedashboardtamu.onrender.com/get_evals/${selectedCourse?.subjectCode}/${selectedCourse?.courseNumber}/${instructor.name}`);
      const data = await response.json();
  
      instructor.evalResponses = data.eval_answers;
  
      if (selectedInstructors == null) {
        setSelectedInstructors([instructor]);
      } else {
        setSelectedInstructors([...selectedInstructors, instructor]);
      }
    } catch (error) {
      console.error('Error fetching evals:', error);
    }
  }

  function removeInstructor(instructor: Instructor) {
    if (selectedInstructors == null) {
      return;
    }
    setSelectedInstructors(selectedInstructors.filter(i => i.name !== instructor.name));
  }

  return (
        <div className='dashboard-container'>
          <div className='input-container'>
            <CourseSelect onCourseChange={setSelectedCourse} />
            <InstructorSelect instructors={instructors} addInstructor={addInstructor} removeInstructor={removeInstructor} loading={isFetching}  />
          </div>
          <GradeDistDisplay instructors={selectedInstructors} course={selectedCourse}/>
          <div className='eval-container'>
            <CourseEvalDisplay instructors={selectedInstructors} onChange={sendHeight} />
          </div>
        </div>
    );
};

export default Dashboard;