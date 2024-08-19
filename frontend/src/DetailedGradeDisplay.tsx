import React, { useEffect, useRef, useState } from "react";
import { Instructor, Course } from "./Dashboard";
import { Chart } from "chart.js";

interface DetailedGradeDisplayProps {
    instructor: Instructor;
    course: Course;
}

interface GradeData {
    a: number;
    b: number;
    c: number;
    d: number;
    f: number;
  }

  const DetailedGradeDisplay: React.FC<DetailedGradeDisplayProps> = ({ instructor, course }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart<"line"> | null>(null);
    const [gradeData, setGradeData] = useState<Record<string, GradeData> | null>(null);
  
    useEffect(() => {
      fetch(`https://gradedashboardtamu.onrender.com/get_detailed_grades/${course.subjectCode}/${course.courseNumber}/${instructor.name}`)
        .then((response) => response.json())
        .then((data) => {
          setGradeData(data);
        })
        .catch((error) => console.error('Error fetching instructors:', error));
    }, [instructor, course]);
  
    useEffect(() => {
      if (chartInstance.current !== null) {
        chartInstance.current.destroy();
      }
  
      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        if (ctx && gradeData) {
          chartInstance.current = new Chart(ctx, {

            type: 'line',
            data: {
              labels: Object.keys(gradeData),
              datasets: [
                {
                  label: 'A',
                  data: Object.values(gradeData).map((yearData) => yearData.a),
                  fill: false,
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 0.8)",
                  borderWidth: 1
                },
                {
                  label: 'B',
                  data: Object.values(gradeData).map((yearData) => yearData.b),
                  fill: false,
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                  borderColor: "rgba(54, 162, 235, 0.8)",
                  borderWidth: 1
                },
                {
                    label: 'C',
                    data: Object.values(gradeData).map((yearData) => yearData.c),
                    fill: false,
                    backgroundColor: "rgba(255, 206, 86, 0.2)",
                    borderColor: "rgba(255, 206, 86, 0.8)",
                    borderWidth: 1
                },
                {
                    label: 'D',
                    data: Object.values(gradeData).map((yearData) => yearData.d),
                    fill: false,
                    backgroundColor: "rgba(255, 159, 64, 0.2)",
                    borderColor: "rgba(255, 159, 64, 0.8)",
                    borderWidth: 1
                },
                {
                    label: 'F',
                    data: Object.values(gradeData).map((yearData) => yearData.f),
                    fill: false,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 0.8)",
                    borderWidth: 1
                }, 
              ]
            },
            options: {
              maintainAspectRatio: true,
              plugins: {
                  legend: {
                      display: false,
                  },
              },
              scales: {
                  x: {
                      beginAtZero: true,
                      ticks: {
                          autoSkip: false, 
                      },
                  },
                  y: {
                      beginAtZero: true,
                      position: 'right',
                  },
              },
          },
          });
        }
      }
    }, [gradeData]);
  
    return (
      <div className="detailed-grade-container">
        <div>
            <p>Grade Distribution for <b>{instructor.name}</b> - {course.subjectCode} {course.courseNumber}</p>
            <canvas width="100vw" ref={chartRef}></canvas>
        </div>
      </div>
    );
  };

export default DetailedGradeDisplay;