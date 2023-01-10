import React from "react";
import Ticket from "../../../redux/reducers/tickets/types";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Tooltip } from "react-tooltip";

interface Props {
  tickets: Ticket[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel: React.FC<any> = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const TicketsByType: React.FC<Props> = ({ tickets }) => {
  // Create an array of objects (ticketType: string, count: number) for each ticket type
  const data: any[] = [];
  tickets.forEach((ticket) => {
    const ticketType = ticket.type;
    const ticketTypeIndex = data.findIndex(
      (obj) => obj.ticketType === ticketType
    );
    if (ticketTypeIndex === -1) {
      data.push({ ticketType, count: 1 });
    } else {
      data[ticketTypeIndex].count++;
    }
  });

  // Create a pie chart with the ticket type and count using recharts
  return (
    <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
  );
};

export default TicketsByType;
