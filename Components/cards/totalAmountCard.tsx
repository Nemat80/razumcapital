"use client";

import { getInvestmentsInfo } from "@/lib/actions/investment.actions";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TotalAmountCard() {
  const [result, setResult] = useState<
    { 
      investments: Omit<any, never>[]; 
      totalSum: number; 
      totalLength: number; 
      perMonthCount: number; 
      perSixMonthCount: number;   
      yearlyData: {
        date: string;
        amountFullYear: unknown;
    }[];
    } | undefined
  >();

  useEffect(() => {
    async function TotalAmount() {
      try {
        const investments = await getInvestmentsInfo();
        setResult(investments);
      } catch (error) {
        console.error(error);
      }
    }
    TotalAmount();
  }, []);

  

  return (
      <div className="p-4 my-8 flex flex-1 flex-col rounded-md text-light-1 bg-dark-2 ">
        <p className="text-[18px] font-semibold flex gap-4">Общая сумма инвестиций</p>
        <div className="flex flex-row flex-wrap space-y-4 gap-4">
          <p className="text-[28px] mb-4 font-bold">${result?.totalSum}</p>
        </div>
        <div className="flex flex-1 w-full">
        <ResponsiveContainer width="100%" height={350}>
                <BarChart data={result?.yearlyData}>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={true}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={14}
                    tickLine={true}
                    axisLine={true}
                    tickFormatter={(value) => `${value}$`}
                  />
                  <CartesianGrid />
                  <Legend />
                  <Bar 
                  dataKey="amountFullYear"
                   stackId="b" 
                   fill="#fff"  
                   label={{ fill: 'black', fontSize: 15, fontWeight:500, }}/>
                </BarChart>
              </ResponsiveContainer>
        </div>
      </div>
  );
}
