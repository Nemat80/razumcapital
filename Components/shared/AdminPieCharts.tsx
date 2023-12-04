"use client";

import { getInvestmentsInfo } from "@/lib/actions/investment.actions";
import { getAllUsersInfo } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function AdminPieCharts() {
  const [users, setUsers] = useState<{ usersCount: number } | undefined>();




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
        const users = await getAllUsersInfo();
        setUsers(users);
      } catch (error) {
        console.error(error);
      }
    }
    usersCount();
  }, []);

  useEffect(() => {
    async function TotalAmount() {
      try {
        const investments = await getInvestmentsInfo();
        setInvestments(investments);
      } catch (error) {
        console.error(error);
      }
    }
    TotalAmount();
  }, []);

  const data = [
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
    <div className="flex flex-wrap flex-row gap-4 w-full mt-4">
      <div className="flex  items-center p-4 rounded-md text-light-1 bg-dark-2">
        <div className="flex flex-1 gap-4 flex-col">
          <div className="border rounded-md p-1 adaptive">
            <p>С реинвестом </p>
            <p className="font-bold">${investments?.perSixMonthAmount}</p>
          </div>
          <div className="border rounded-md p-1 border-green-500">
            <p>Без реинвеста</p>
            <p className="font-bold">${investments?.perMonthAmount}</p>
          </div>
        </div>
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

      <div className="p-4  flex-1 flex-col gap-2 rounded-md text-light-1 bg-dark-2">
        <div className="p-3 flex gap-4 flex-col w-full">
          <div className="flex flex-col justify-center px-4 py-2 items-center border rounded-md p-1 adaptive">
            <p>Кол-во с реинвестом </p>
            <p className="font-bold text-[28px]">{investments?.perSixMonthCount}</p>
          </div>
          <div className="flex flex-col  items-center border rounded-md p-1 border-green-500">
            <p>Кол-во без реинвеста</p>
            <p className="font-bold text-[28px]">{investments?.perMonthCount}</p>
          </div>
        </div>
      </div>
      <div className="p-2 flex-1 flex-col gap-2 rounded-md text-light-1 bg-dark-2">
      <div className="flex h-full w-full flex-col gap-5 px-5 justify-center items-center border rounded-md p-1 border-green-500">
            <p className="font-bold text-[18px] " >Кол-во инвесторов</p>
            <p className="font-bold text-[30px]">{users?.usersCount}</p>
          </div>
      </div>
    </div>
  );
}
