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
    });

    return (
        <>
            <div className="grade-dists-container">
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
        </>
    );
};

export default GradeDistDisplay;