import React from "react";
import { Instructor } from "./Dashboard";
import GradeCard from "./GradeCard";

interface GradeDistDisplayProps {
    instructors: Instructor[] | null;
}

const GradeDistDisplay: React.FC<GradeDistDisplayProps> = ({ instructors }) => {
    // Sort instructors by GPA
    const sortedInstructors = [...(instructors || [])].sort((a, b) => b.GPA - a.GPA);

    return (
        <div className="grade-dists-container">
            {sortedInstructors.map((instructor, index) => (
                <GradeCard
                    instructor={instructor}
                    isHighestGPA={index === 0} // Check if it's the instructor with the highest GPA
                />
            ))}
        </div>
    );
};

export default GradeDistDisplay;