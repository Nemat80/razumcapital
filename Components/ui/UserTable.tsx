"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type InvestmentData = {
  id: string;
  amount: number;
  date: string;
  _id: string;
};

type TableProps = {
  investments: InvestmentData[];
};

const UserTable: React.FC<TableProps> = ({ investments }) => {
  const renderInvestmentRows = (investment: InvestmentData) => {
    const data = [];
    const investmentRows = [];
    let totalAmount = 0;

    for (let i = 0; i < 33; i++) {
      const currentDate = new Date(investment.date);
      currentDate.setMonth(currentDate.getMonth() + i);
      const endDate = currentDate.toISOString().slice(0, 10);

      const investmentAmount = investment.amount * Math.pow(1.05, i);
      const profit = investmentAmount * 0.05;
      const total = investmentAmount + profit;

      if (i % 6 === 0 || i % 12 === 0 || i === 32) {
        data.push({
          date: endDate,
          Investment: investment.amount.toFixed(2),
          Profit: profit.toFixed(2),
          Total: total.toFixed(2),
        });

        console.log(data);
      }

      if (i === 0) {
        investmentRows.push(
          <div className="w-full flex flex-col">
            <h1 className="head-text mb-5 ">Инвестиция : {endDate} </h1>
            <div className="">
              <ResponsiveContainer width="100%" height={350} className="">
                <BarChart data={data}>
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
                  <Tooltip />
                  <CartesianGrid />
                  <Legend />
                  <Bar
                    dataKey="Investment"
                    stackId="a"
                    fill="green"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar dataKey="Total" stackId="b" fill="#adfa1d" />
                  <Bar dataKey="Profit" stackId="b" fill="#f1f230" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <thead className="w-full">
              <tr className="w-full flex justify-between py-1 px-2 rounded-xl bg-zinc-600">
                <th>Дата</th>
                <th>Инвестиция</th>
                <th>Прибль</th>
                <th>Итого</th>
              </tr>
            </thead>
          </div>
        );
      }

      totalAmount = total;

      investmentRows.push(
        <tr key={i} className="flex justify-between px-2">
          <td>{endDate}</td>
          <td className="">{investmentAmount.toFixed(2)}</td>
          <td>{profit.toFixed(2)}</td>
          <td>{total.toFixed(2)}</td>
        </tr>
      );
    }

    investmentRows.push(
      <>
        <tr
          key="total"
          className="flex justify-between text-start mt-4 mb-5 border-b-2 border-stone-300"
        >
          <td>Итого:</td>
          <td>{totalAmount.toFixed(2)}</td>
          <td>{(totalAmount - investment.amount).toFixed(2)}</td>
          <td>{totalAmount.toFixed(2)}</td>
        </tr>
      </>
    );

    return investmentRows;
  };

  return (
    <table className="w-full text-light-1 flex flex-col bg-zinc-900 rounded-xl mt-5 px-5 py-5">
      <tbody className="mt-3 flex flex-col gap-3">
        {investments.map((investment) => renderInvestmentRows(investment))}
      </tbody>
    </table>
  );
};

export default UserTable;