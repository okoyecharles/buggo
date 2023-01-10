import React, { HTMLAttributes, useEffect, useState } from "react";
import Ticket from "../../../redux/reducers/tickets/types";
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

const TicketsByType: React.FC<Props> = ({ tickets }) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const ticketData: any[] = [];
    for (const ticket of tickets) {
      const ticketType = ticket.type;

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

  return (
    <div className="row-span-1 bg-gray-900 p-4 rounded shadow flex-1">
      <h3 className="mb-2 font-bold text-gray-300 flex justify-between">
        Tickets by Type{" "}
        <AiFillInfoCircle
          className="text-gray-500 text-xl hover:text-blue-600 hover:scale-105 outline-none transition"
          id="ticketStatType__info"
        />
      </h3>
      <Tooltip
        anchorId="ticketStatType__info"
        html={`<div class="text-center">Percentage of tickets you've created,<br> grouped by type.</div>`}
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
    </div>
  );
};

export default TicketsByType;
