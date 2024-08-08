import React, { useEffect } from "react";
import { Chart } from "chart.js";

interface PieChartProps {
  data: number[] | undefined;
  labels: string[];
  id: string;
  width?: string;
  height?: string;
  updateLegend?: () => void;
}

const CustomPieChart: React.FC<PieChartProps> = ({
  data,
  labels,
  id,
  width = "auto", // Default width if not provided
  height = "auto", // Default height if not provided
  updateLegend
}) => {
  useEffect(() => {
    if (data && data.length > 0) {
      const ctx = document.getElementById(id) as HTMLCanvasElement;

      const chart = new Chart(ctx, {
        type: "pie",
        data: {
          datasets: [
            {
              data: data,
              backgroundColor: [
                "rgba(75, 192, 192, 0.4)",
                "rgba(255, 206, 86, 0.4)",
                "rgba(54, 162, 235, 0.4)",
                "rgba(255, 99, 132, 0.4)",
                "rgba(153, 102, 255, 0.4)",
                "rgba(255, 159, 64, 0.4)",
              ],
              borderColor: [
                "rgba(75, 192, 192, .8)",
                "rgba(255, 206, 86, .8)",
                "rgba(54, 162, 235, .8)",
                "rgba(255, 99, 132, .8)",
                "rgba(153, 102, 255, .8)",
                "rgba(255, 159, 64, .8)",
              ],
            },
          ],
          labels: labels,
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }
  }, [data, labels]);

  return <canvas id={id} width={width} height={height} />;
};

export default CustomPieChart;
