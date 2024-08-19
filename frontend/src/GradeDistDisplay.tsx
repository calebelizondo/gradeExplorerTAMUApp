import React, { useEffect, useState } from "react";
import { Course, Instructor } from "./Dashboard";
import GradeCard from "./GradeCard";
import DetailedGradeDisplay from "./DetailedGradeDisplay";

interface GradeDistDisplayProps {
    instructors: Instructor[] | null;
    course: Course | null;
}

const GradeDistDisplay: React.FC<GradeDistDisplayProps> = ({ instructors, course }) => {
    // Sort instructors by GPA
    const sortedInstructors = [...(instructors || [])].sort((a, b) => b.GPA - a.GPA);
    const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(instructors ? instructors[0] : null);

    const instructorClickHandler = (instructor: Instructor) => {
        if (instructor == selectedInstructor) setSelectedInstructor(null);
        else setSelectedInstructor(instructor); 
    }

    useEffect(() => {
        if (selectedInstructor !== null && 
            !sortedInstructors.includes(selectedInstructor))
            setSelectedInstructor(null);
    }, [instructors]);

    return (
        <>
            <div className="grade-dists-container">
                <div className="card-display-container" style={ {width: "100%"}}>
                {sortedInstructors.map((instructor) => (
                    <GradeCard
                        key={instructor.name}
                        instructor={instructor}
                        isSelected={instructor === selectedInstructor} // Check if it's the instructor with the highest GPA
                        onClick={instructorClickHandler}
                    />
                ))}
                </div>
            </div>
            {selectedInstructor !== null && course !== null && (
                <DetailedGradeDisplay instructor={selectedInstructor} course={course}/>
            )}
            {course && instructors !== null && (
                <p><i><a href="https://www.kaggle.com/datasets/sst001/texas-a-and-m-university-grades-and-aefis-dataset">Grade data</a> from Fall 2020-Fall 2022. Select an instructor for more details.</i></p>
            )}
        </>
    );
};

export default GradeDistDisplay;