import { Instructor } from '../App';
import Spinner from '../spinner/Spinner';

interface InstructorSelectProps {
  instructors: Instructor[];
  setInstructors: (i: Instructor[]) => void;
}

const InstructorSelect: React.FC<InstructorSelectProps> = ({instructors, setInstructors}) => {


  return (
    <div>
      <div
        style={{
          maxHeight: '200px', 
          minHeight: '200px',
          overflowY: 'auto',
          padding: '10px',
          border: '1px solid #ddd', 
        }}
      >
        {
          instructors.map((instructor: Instructor) => (
            <div key={instructor.name} className="flex items-center mb-2">
              <input
              key={instructor.name}
                type="checkbox"
                id={instructor.name}
                checked={instructor.shown}
                onChange={() => {
                  setInstructors(
                    instructors.map((i: Instructor) =>
                      i === instructor
                        ? { ...i, shown: !i.shown, selected: false }
                        : i 
                    )
                  );
                }}
                className="mr-2"
              />
              <label htmlFor={instructor.name} className="text-sm">{instructor.name}</label>
            </div>
          ))
        } 
        </div>
    </div>
  );
};

export default InstructorSelect;
