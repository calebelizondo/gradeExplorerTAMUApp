import { useEffect, useState } from 'react';
import './App.css';
import Form from './Form/Form';
import InstructorSelect from './InstructorSelect/InstructorSelect';
import CardDisplay from './CardDisplay/CardDisplay';
import { BACKEND_URL } from './consts';
import Spinner from './spinner/Spinner';
import InstructorDisplay from './InstructorDisplay/InstructorDisplay';

export type FormState = {subjectCode: string, courseNumber: string | null};
export type Grades = {a: number, b: number, c: number, d: number, f: number, q: number};
export type Instructor = {grades: Grades[], gpa: number, name: string, shown: boolean, selected: boolean}; 

function App() {

  const [formState, setFormState] = useState<FormState | null>(null);
  const [appState, setAppState] = useState<{subjectCode: string, courseNumber: string} | null>(null);
  const [instructors, setInstructors] = useState<Instructor[] | null>(null);

  const [courseNumbers, setCourseNumbers] = useState<Record<string, string[]> | null>(null);

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

  useEffect(() => {
    fetch(`${BACKEND_URL}/get_codes`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const sortedCourseNumbers = Object.keys(data)
          .sort() 
          .reduce((sorted: Record<string, string[]>, key: string) => {
            sorted[key] = data[key];
            return sorted;
          }, {});
        setCourseNumbers(sortedCourseNumbers);
      })
      .catch((error) => {
        console.error('Error fetching course numbers:', error);
      });
  }, []);

  const getInstructors = (subjectCode: string, courseNumber: string) => {
    fetch(`${BACKEND_URL}/get_instructors?dept=${subjectCode}&number=${courseNumber}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      return response.json();
    })
    .then((data) => {
      let new_instructors = data.map((i: any) => {return {...i, shown: true, selected: false}});
      new_instructors[0].selected = true;
      setInstructors(new_instructors);
    })
    .catch((error) => {
      console.error('Error fetching course numbers:', error);
    });
  };


  useEffect(() => {
    if (!formState) {
      setInstructors(null);
    } else {
      if (formState.courseNumber !== null) {
        getInstructors(formState.subjectCode, formState.courseNumber);
        setAppState({subjectCode: formState.subjectCode, courseNumber: formState.courseNumber});
      }
    }
  }, [formState]); 

  const selectedInstructor = instructors?.find((i: Instructor) => {return i.selected});

  return (
    <>
      { courseNumbers !== null && (
        <div>
          <div className="flex flex-col sm:flex-row sm:space-x-8 p-4">
            <div className="w-full sm:w-1/2">
              <Form formState={formState} setFormState={setFormState} courseNumbers={courseNumbers}/>
            </div>
            <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
              { instructors &&
                <InstructorSelect instructors={instructors} setInstructors={setInstructors}/>
              }
            </div>
          </div>
          {instructors && appState && 
            <>
              <CardDisplay instructors={instructors} setInstructors={setInstructors}/>
              { selectedInstructor &&
                <>
                  <br />
                  <InstructorDisplay instructor={selectedInstructor} formState={appState}/>
                </>
              }
            </>
          }
        </div>
      )}

      { courseNumbers === null && (
        <div className="w-full h-screen flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
}

export default App;
