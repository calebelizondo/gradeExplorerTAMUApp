import React, { useEffect, useState } from "react";
import { Instructor, Course } from "./Dashboard";

interface DetailedGradeDisplayProps {
    instructor: Instructor;
    course: Course;
}

const DetailedGradeDisplay: React.FC<DetailedGradeDisplayProps> = ({ instructor, course }) => {

    const [gradeData, setGradeData] = useState({});

    useEffect(() => {
        fetch(`https://gradedashboardtamu.onrender.com/get_detailed_grades/${course.subjectCode}/${course.courseNumber}/${instructor.name}`)
            .then(response => response.json())
            .then(data => {
                setGradeData(data);
            })
        .catch(error => console.error('Error fetching instructors:', error));
    }, [])

    console.log(gradeData);

    return (
        <div>
        </div>
    );
};

export default DetailedGradeDisplay;