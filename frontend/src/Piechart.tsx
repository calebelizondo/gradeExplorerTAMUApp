import React, { useEffect } from "react";
import { Chart } from "chart.js";

interface PieChartProps {
  data: number[] | undefined;
  labels: string[];
  id: string;
  width?: string;
  height?: string; 
  hideLegend?: boolean;
}

const CustomPieChart: React.FC<PieChartProps> = ({
  data,
  labels,
  id,
  width = "auto", // Default width if not provided
  height = "auto", // Default height if not provided
  hideLegend = false,
}) => {
  useEffect(() => {
    if (data && data.length > 0) {
      const ctx = document.getElementById(id) as HTMLCanvasElement;

      const myPieChart = new Chart(ctx, {
        type: "pie",
        data: {
          datasets: [
            {
              data: data,
              backgroundColor: [
                "rgba(75, 192, 192, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 99, 132, 0.8)",
              ],
            },
          ],
          labels: labels,
        },
      });

      return () => {
        myPieChart.destroy();
      };
    }
  }, [data, labels]);

  return (
    <div>
      <canvas id={id} width={ width } height={height}></canvas>
    </div>
  );
};

export default CustomPieChart;
