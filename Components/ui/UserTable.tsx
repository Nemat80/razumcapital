"use client";

import React, { useState } from "react";
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
import { Button } from "./button";
import { saveAs } from "file-saver";

type InvestmentData = {
  id: string;
  amount: number;
  date: string;
  _id: string;
  contract: string;
  perMonth: string;
};

type TableProps = {
  investments: InvestmentData[];
};

const UserTable: React.FC<TableProps> = ({ investments }) => {
  const renderInvestmentRows = (investment: InvestmentData) => {
    const handleDownload = async () => {
      try {
        const response = await fetch(investment.contract);
        const blob = await response.blob();
        saveAs(blob, `договор_от_${investment.date}_${investment.amount}$`);
      } catch (error) {
        console.error("Ошибка при загрузке файла", error);
      }
    };

    const [show, setShow] = useState(false);
    const toggleShow = () => setShow(!show);

    const data = [];
    const investmentRows = [];
    const investmentInfo = [];
    const investmentDiagram = [];

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
      }

      if (i === 0) {
        investmentDiagram.push(
          <div className="w-full flex flex-col">
            <h1 className="head-text mb-5 ">
              {investmentAmount}$ от {endDate}{" "}
            </h1>
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
          </div>
        );
      }

      totalAmount = total;

      investmentInfo.push(
        <tr key={i} className="flex justify-between px-2">
          <td>{endDate}</td>
          <td>{investment.amount}</td>
          <td className="">{investmentAmount.toFixed(2)}</td>
          <td>{profit.toFixed(2)}</td>
          <td>{total.toFixed(2)}</td>
        </tr>
      );
    }

    investmentInfo.push(
      <>
        <tr
          key="total"
          className="flex justify-between text-start mt-4 mb-5 border-b-2 border-stone-300"
        >
          <td>Итого:</td>
          <td>{investment.amount}</td>
          <td>{totalAmount.toFixed(2)}</td>
          <td>{(totalAmount - investment.amount).toFixed(2)}</td>
          <td>{totalAmount.toFixed(2)}</td>
        </tr>
      </>
    );

    investmentRows.push(
      investment.perMonth === "PER_MONTH" ? (
        <>
          <div className="flex py-3 px-2 items-center  justify-around gap-3  rounded border border-current responsive_text max-sm:flex-col max-sm:items-start max-sm:text-[18px]">
            <div className="flex flex-col  border-r border-current pr-3 gap-2 max-sm:flex-row max-sm:border-hidden max-sm:flex-wrap">
              <legend className="flex gap-2 items-center  max-sm:text-[14px]">
                <p>Ежемесячная Ивестиция</p>
                <p className="text-body-bold">от {investment.date}</p>
              </legend>
              <p className="text-body-bold">{investment.amount}$</p>
            </div>

            <div className="flex flex-col border-r border-current gap-4 pr-3 max-sm:border-hidden max-sm:flex-row">
              <legend className="">Процент ежемесячно</legend>
              <p className="text-body-bold">{investment.amount * 0.05}$</p>
            </div>

            <div className="flex flex-col border-r border-current text-start gap-4 pr-3 max-sm:border-hidden max-sm:flex-row">
              <legend className="">Прибль за 3 года</legend>
              <p className="text-body-bold">
                {investment.amount * 0.05 * 33}$
              </p>
            </div>

            {investment.contract === "" ? (
              <>
                <Button className="max-sm:w-full">Без договора</Button>
              </>
            ) : (
              <>
                <Button
                  className="bg-yellow-300 max-sm:w-full"
                  onClick={handleDownload}
                >
                  Скачать договор
                </Button>
              </>
            )}
          </div>

          {show ? (
            <section className="flex flex-col justify gap-3 duration-200">
              {investmentInfo}
            </section>
          ) : null}
        </>
      ) : (
        <>
          <div className="flex justify-between p-3 items-center border-t-2 border-stone-400">
            {investmentDiagram}
          </div>
          {investment.contract === "" ? (
            <>
              <Button className="">Без договора</Button>
            </>
          ) : (
            <>
              <Button className="bg-yellow-300 " onClick={handleDownload}>
                Скачать договор
              </Button>
            </>
          )}

          <Button
            className="bg-green-400 mb-4 "
            type="button"
            onClick={toggleShow}
          >
            Просмотр ежемесячного отчёта
          </Button>

          {show ? (
            <section className="flex flex-col justify gap-3 duration-200">
              <thead className="w-full">
                <tr className="w-full flex justify-between py-1 px-2 rounded-xl bg-zinc-600">
                  <th>Дата</th>
                  <th>Инвестиция</th>
                  <th>Баланс</th>
                  <th>Прибль</th>
                  <th>Итого</th>
                </tr>
              </thead>
              {investmentInfo}
            </section>
          ) : null}
        </>
      )
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
