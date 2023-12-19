"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { getInvestmentsByUserId } from "@/lib/actions/investment.actions";

interface Props {
  objectId: string;
}

export default function UserPieStatCount({ objectId }: Props) {
  const [investments, setInvestments] = useState<
    | {
        investments: Omit<any, never>[];
        totalSum: number;
        totalLength: number;
        perMonthCount: number;
        perSixMonthCount: number;
        perMonthAmount: number;
        perSixMonthAmount: number;
      }
    | undefined
  >();

  useEffect(() => {
    async function usersCount() {
      try {
        const investments = await getInvestmentsByUserId(objectId);
        setInvestments(investments);
      } catch (error) {
        console.error(error);
      }
    }
    usersCount();
  }, []);

  const data = [
    {
      name: "С реинвестом",
      value: investments?.perSixMonthAmount,
    },
    {
      name: "Без реинвеста",
      value: investments?.perMonthAmount,
    },
  ];
  
  const data2 = [
    {
      name: "С реинвестом",
      value: investments?.perSixMonthCount,
    },
    {
      name: "Без реинвеста",
      value: investments?.perMonthCount,
    },
  ];

  const COLORS = ["#ffffff", "#54ef6d", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <>
        <text
          x={x}
          y={y}
          fill="#2e2c29"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </>
    );
  };

  return (
    <div className="flex gap-2 flex-wrap  bg-dark-2 rounded-md p-4 items-center justify-center">
      <div className="flex gap-4 flex-col">
        <div className="border rounded-md  adaptive py-2 px-4">
          <p>С реинвестицией </p>
          <p className="font-bold">${investments?.perSixMonthAmount}</p>
        </div>
        <div className="border rounded-md py-2 px-4 border-green-500">
          <p>Без реинвестиции</p>
          <p className="font-bold">${investments?.perMonthAmount}</p>
        </div>
      </div>
      <div className="flex-1">
        <PieChart width={220} height={160}>
          <Pie
            data={data}
            cx="65%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            innerRadius={30}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
      <div className="p-3 flex gap-4 flex-col flex-1 w-full items-center">
          <div className="flex flex-col justify-center px-4 py-2 items-center border rounded-md  adaptive">
            <p>Кол-во с реинвестицией </p>
            <p className="font-bold text-[28px]">{investments?.perSixMonthCount}</p>
          </div>
          <div className="flex flex-col  items-center border rounded-md py-2 px-4 border-green-500">
            <p>Кол-во без реинвестиции</p>
            <p className="font-bold text-[28px]">{investments?.perMonthCount}</p>
          </div>
        </div>
        <div className="flex-1">
        <PieChart width={220} height={160}>
          <Pie
            data={data2}
            cx="65%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            innerRadius={30}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
        </div>
    </div>
  );
}
