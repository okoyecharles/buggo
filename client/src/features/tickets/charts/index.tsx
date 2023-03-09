import { useMemo } from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import { Tooltip } from "react-tooltip";
import { Cell, Pie, PieChart, Tooltip as ChartTooltip } from "recharts";
import renderCustomizedLabel from "./Label";

interface Props {
  tickets: any[];
  subject: string;
}
const COLORS = ["#f78c54", "#f56c24", "#db520a", "#db520a", "#7a2e06"];
const TicketGroupChart: React.FC<Props> = ({ tickets, subject }) => {
  const data = useMemo(() => {
    const data: any[] = [];
    for (const ticket of tickets) {
      const ticketField = ticket[subject];
      const ticketFieldIndex = data.findIndex(
        (obj) => obj.name === ticketField
      );
      if (ticketFieldIndex === -1) {
        data.push({ name: ticketField, count: 1 });
      } else {
        data[ticketFieldIndex].count++;
      }
    }
    return data;
  }, [tickets]);

  return (
    <>
      <AiFillInfoCircle
        className="text-gray-500 text-xl hover:text-blue-400 hover:scale-105 outline-none transition absolute right-3 top-3"
        id={`ticketStat${subject}__info`}
      />
      <Tooltip
        anchorId={`ticketStat${subject}__info`}
        html={`<div class="text-center">Percentage of tickets you've created,<br> grouped by ${subject}.</div>`}
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
      <p className="font-bold text-xsm uppercase text-gray-200 flex justify-between absolute bottom-2 left-2 select-none">
        {subject}
      </p>
    </>
  );
};

export default TicketGroupChart;
