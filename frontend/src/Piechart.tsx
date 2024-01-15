import React from "react";
import { PieChart, Pie, Cell } from "recharts";

interface PieChartProps {
  responses: number[] | undefined;
  labels: string[];
}

const CustomPieChart: React.FC<PieChartProps> = ({ responses, labels }) => {
  if (!responses || responses.length === 0) {
    return null;
  }

  const data = labels.map((label, index) => ({
    name: label,
    value: responses[index],
  }));

  const COLORS = ["red", "orange", "yellow", "green", "blue", "purple"];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default CustomPieChart;
