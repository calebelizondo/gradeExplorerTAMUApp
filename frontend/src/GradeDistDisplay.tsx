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

    useEffect(() => {
        if (instructors == null || course == null) setSelectedInstructor(null);
        if (sortedInstructors.length === 1) setSelectedInstructor(sortedInstructors[0]);
    });

    return (
        <>
            <div className="grade-dists-container">
                <div className="card-display-container">
                {sortedInstructors.map((instructor) => (
                    <GradeCard
                        key={instructor.name}
                        instructor={instructor}
                        isSelected={instructor === selectedInstructor} // Check if it's the instructor with the highest GPA
                        onClick={setSelectedInstructor}
                    />
                ))}
                </div>
                {selectedInstructor !== null && course !== null && (
                    <DetailedGradeDisplay instructor={selectedInstructor} course={course}/>
                )}
            </div>
        </>
    );
};

export default GradeDistDisplay;