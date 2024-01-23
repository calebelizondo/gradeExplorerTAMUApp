import { Instructor } from "./Dashboard"

interface InstructorSelectorProps {
    instructors: Instructor[] | null;
    addInstructor: (instructor: Instructor) => void;
    removeInstructor: (instructor: Instructor) => void;
    loading: boolean;
};

const InstructorSelect:React.FC<InstructorSelectorProps> = ({ instructors, addInstructor, removeInstructor, loading }) => {
    
    //handles check and uncheck of instructor
    const instructorCheckHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const instructorName = event.target.parentElement?.textContent;
        if (instructorName && instructors) {
            const selectedInstructor = instructors.find((instructor: Instructor) => instructor.name === instructorName.trim());

            if (selectedInstructor) {
                if (event.target.checked) {
                    addInstructor(selectedInstructor);
                } else {
                    removeInstructor(selectedInstructor);
                }
            }
        }
    }

    return (
        <div className="instructor-selection-container">
            {loading ? (
                <div className="loading-icon-container">
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
                
            ) : (
                <>
                {instructors ? (
                    <p>Select instructors to compare:</p>  
                ) : (
                    <p>Select section and course codes to view instructors:</p>
                )}
                <ul className="instructor-select-list">
                    {instructors?.map((instructor: Instructor) => (
                        <li key={instructor.name}>
                            <label>
                                <input type="checkbox" onChange={instructorCheckHandler} />
                                {instructor.name}
                            </label>
                        </li>
                    ))}
                </ul>

                </>
            )}
        </div>
    );
};

export default InstructorSelect;
