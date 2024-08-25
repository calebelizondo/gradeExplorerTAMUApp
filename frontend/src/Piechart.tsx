import React, { useEffect } from "react";
import { Chart } from "chart.js";

interface PieChartProps {
  data: number[] | undefined;
  labels: string[];
  id: string;
  width?: string;
  height?: string;
  updateLegend?: (legend: string) => void;
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

      // Custom plugin to generate the legend and pass it to the parent
      const customLegendPlugin = {
        id: "customLegend",
        afterUpdate(chart: any) {
          if (updateLegend) {
            const legendItems = chart.legend.legendItems;
            const legendHtml = legendItems
              .map(
                (item: any) =>
                  `<div style="display: flex; align-items: center; margin-right: 10px;">
                     <div style="width: 12px; height: 12px; background-color: ${item.fillStyle}; margin-right: 5px;"></div>
                     <span style="color: #333;">${item.text}</span>
                   </div>`
              )
              .join("");
            updateLegend(legendHtml);
          }
        },
      };

      const chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
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
        },
        options: {
          plugins: {
            legend: {
              display: false, // We handle the legend manually
            },
          },
        },
        plugins: [customLegendPlugin], // Add the custom plugin here
      });

      return () => {
        chart.destroy();
      };
    }
  }, [data, labels, updateLegend, id]);

  return <canvas id={id} width={width} height={height} />;
};

export default CustomPieChart;
