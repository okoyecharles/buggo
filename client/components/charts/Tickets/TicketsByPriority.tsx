import React, { useEffect, useState } from 'react';
import Ticket from '../../../redux/reducers/tickets/types';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
} from 'recharts';
import { off } from 'process';

interface Props {
  tickets: Ticket[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
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
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const TicketsByPriority: React.FC<Props> = ({ tickets }) => {
  // Create an array of objects (ticketType: string, count: number) for each ticket type
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const ticketData: any[] = [];
    for (let i = 0; i < tickets.length; i++) {
      const ticketPriority = tickets[i].priority;

      const ticketPriorityIndex = ticketData.findIndex(
        (obj) => obj.name === ticketPriority
      );
      if (ticketPriorityIndex === -1) {
        ticketData.push({ name: ticketPriority, count: 1 });
      } else {
        ticketData[ticketPriorityIndex].count++;
      }
    }
    setData(ticketData);
  }, [tickets]);

  // Create a pie chart with the ticket type and count using recharts
  return (
    <>
      <h3>Tickets by Priority</h3>
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
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <ChartTooltip />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default TicketsByPriority;
