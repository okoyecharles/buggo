import React, { useEffect, useState } from 'react';
import Ticket from '../../../redux/reducers/tickets/types';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
} from 'recharts';

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

const TicketsByType: React.FC<Props> = ({ tickets }) => {
  // Create an array of objects (ticketType: string, count: number) for each ticket type
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const ticketData: any[] = [];
    for (let i = 0; i < tickets.length; i++) {
      const ticketType = tickets[i].type;

      const ticketTypeIndex = ticketData.findIndex(
        (obj) => obj.name === ticketType
      );
      if (ticketTypeIndex === -1) {
        ticketData.push({ name: ticketType, count: 1 });
      } else {
        ticketData[ticketTypeIndex].count++;
      }
    }
    setData(ticketData);
  }, [tickets]);

  // Create a pie chart with the ticket type and count using recharts
  return (
    <div className="flex flex-col ">
      <h3>Tickets by type</h3>
      <ResponsiveContainer width="100%">
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
    </div>
  );
};

export default TicketsByType;
