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

export default renderCustomizedLabel;