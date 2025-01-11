import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Grades, Instructor } from "../App";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface CardDisplayProps {
  instructors: Instructor[];
  setInstructors: (i: Instructor[]) => void;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ instructors, setInstructors }) => {
  const shownInstructors = instructors
    .filter((i: Instructor) => i.shown)
    .sort((a: Instructor, b: Instructor) => b.gpa - a.gpa);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4">
        {shownInstructors.map((instructor) => {
          let totalGrades = {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            F: 0,
          };

          instructor.grades.forEach((g: Grades) => {
            totalGrades.A += g.a;
            totalGrades.B += g.b;
            totalGrades.C += g.c;
            totalGrades.D += g.d;
            totalGrades.F += g.f;
          });

          const data = {
            labels: Object.keys(totalGrades),
            datasets: [
              {
                label: "Grade Distribution",
                data: Object.values(totalGrades),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.7)", 
                  "rgba(54, 162, 235, 0.7)", 
                  "rgba(255, 206, 86, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(153, 102, 255, 0.7)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)", 
                  "rgba(153, 102, 255, 1)", 
                ],
                borderWidth: 2,
              },
            ],
          };

          const options = {
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: {
                title: {
                  display: false,
                  text: "Grades",
                  color: "#333",
                  font: { size: 14 },
                },
              },
              y: {
                title: {
                  display: false,
                  text: "Frequency",
                  color: "#333",
                  font: { size: 14 },
                },
                beginAtZero: true,
              },
            },
          };

          return (
            <div
              key={instructor.name}
              className={`border rounded-md p-4 shadow-sm min-w-[300px] ${
                instructor.selected ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => {setInstructors(instructors.map((i : Instructor) => {
                return instructor === i ? {...i, selected: true} : {...i, selected: false}
              }))}}
            >
              <h3 className="text-lg font-bold mb-2">{instructor.name}</h3>
              <Bar data={data} options={options} />
              <p className="mt-2 text-gray-700">
                GPA: <span className="font-bold">{instructor.gpa}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardDisplay;
