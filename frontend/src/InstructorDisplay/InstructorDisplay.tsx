import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Grades, Instructor } from "../App";
import { BACKEND_URL } from "../consts";
import Spinner from "../spinner/Spinner";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const colors = ["rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)", 
    "rgba(153, 102, 255, 1)",]

interface InstructorDisplayProps {
  formState: { subjectCode: string; courseNumber: string };
  instructor: Instructor;
}

const InstructorSelect: React.FC<InstructorDisplayProps> = ({ instructor, formState }) => {
  const [instructorData, setInstructorData] = useState<Record<number, Grades> | null>(null);

  useEffect(() => {
    setInstructorData(null);
    fetch(
      `${BACKEND_URL}/get_detailed_instructor?dept=${formState.subjectCode}&number=${formState.courseNumber}&name=${instructor.name}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setInstructorData(data);
      })
      .catch((error) => {
        console.error("Error fetching course numbers:", error);
      });
  }, [instructor]);

  const generateChartData = () => {
    if (!instructorData) return null;

    const gradeKeys: (keyof Grades)[] = ["a", "b", "c", "d", "f"];
    const years = Object.keys(instructorData).map((year) => parseInt(year, 10)).sort();

    const totals = gradeKeys.map((grade) =>
        years.map((year) => {
            const yearlyGrades = instructorData[year] as Grades;
            return yearlyGrades[grade];
        })  
    );

    return {
      labels: years,
      datasets: [
        { label: "A's", data: totals[0], borderColor: colors[0], backgroundColor: colors[0], fill: false },
        { label: "B's", data: totals[1], borderColor: colors[1], backgroundColor: colors[1], fill: false },
        { label: "C's", data: totals[2], borderColor: colors[2], backgroundColor: colors[2], fill: false },
        { label: "D's", data: totals[3], borderColor: colors[3], backgroundColor: colors[3], fill: false },
        { label: "F's", data: totals[4], borderColor: colors[4], backgroundColor: colors[4], fill: false },
      ],
    };
  };

  const chartData = generateChartData();
  return (
    <>
      {instructor && instructorData && chartData ? (
        <div className="instructor-display w-full flex justify-center">
          <div style={{ width: "80%" }}>
            <h2 className="text-xl font-bold mb-4">{instructor.name}</h2>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                      boxWidth: 20, 
                      usePointStyle: true, 
                    },
                  },
                },
                scales: {
                  x: { title: { display: true, text: "Year" } },
                  y: { title: { display: false, text: "Number of Grades" } },
                },
              }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
  
};

export default InstructorSelect;
