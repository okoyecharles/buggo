import React, { HTMLAttributes, useEffect, useState } from "react";
import { Ticket } from "../../../types/models";
import { Cell, Pie, PieChart, Tooltip as ChartTooltip } from "recharts";
import { AiFillInfoCircle } from "react-icons/ai";
import { Tooltip } from "react-tooltip";

interface Props {
  tickets: Ticket[];
}

const COLORS = ["#f78c54", "#f56c24", "#db520a", "#db520a", "#7a2e06"];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel: React.FC<any> = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      className="font-noto scale-75 origin-center fill-gray-400 text-orange-300"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      stroke="#f1f2f3"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const TicketsByStatus: React.FC<Props> = ({ tickets }) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const ticketData: any[] = [];
    for (const ticket of tickets) {
      const ticketStatus = ticket.status;

      const ticketStatusIndex = ticketData.findIndex(
        (obj) => obj.name === ticketStatus
      );
      if (ticketStatusIndex === -1) {
        ticketData.push({ name: ticketStatus, count: 1 });
      } else {
        ticketData[ticketStatusIndex].count++;
      }
    }
    setData(ticketData);
  }, [tickets]);

  return (
    <>
      <h3 className="mb-2 font-bold text-gray-300 flex justify-between">
        Tickets by Status{" "}
        <AiFillInfoCircle
          className="text-gray-500 text-xl hover:text-blue-600 hover:scale-105 outline-none transition"
          id="ticketStatStatus__info"
        />
      </h3>
      <Tooltip
        anchorId="ticketStatStatus__info"
        html={`<div class="text-center">Percentage of tickets you've created,<br> grouped by status.</div>`}
      />
      <div className="flex justify-center">
        <PieChart height={130} width={130}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            label={renderCustomizedLabel}
            labelLine={false}
            outerRadius={65}
            strokeWidth={3}
            stroke="#242629"
            dataKey="count"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <ChartTooltip
            itemStyle={{
              color: "#bbbec4",
              fontSize: "12px",
            }}
            contentStyle={{
              backgroundColor: "#1a1c1f",
              borderRadius: "5px",
              border: "none",
            }}
          />
        </PieChart>
      </div>
    </>
  );
};

export default TicketsByStatus;
