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
import { deleteInvestment } from "@/lib/actions/investment.actions";

type InvestmentData = {
  id: string;
  amount: number;
  date: string;
  _id: string;
};

type TableProps = {
  investments: InvestmentData[];
};

const TableInvestments: React.FC<TableProps> = ({ investments }) => {
  const renderInvestmentRows = (investment: InvestmentData) => {


    const [show, setShow] = useState(false);
    const toggleShow = () => setShow(!show);

    const investmentRows = [];
    const investmentInfo = [];

    const data = [];
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
        investmentInfo.push(
          <div className="w-full flex flex-col">
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
                <th>Баланс</th>
                <th>Прибль</th>
                <th>Итого</th>
              </tr>
            </thead>
          </div>
        );
      }

      totalAmount = total;

      investmentInfo.push(
        <>
          <tr key={i} className="flex justify-between">
            <td>{endDate}</td>
            <td>{investment.amount}</td>
            <td className="">{investmentAmount.toFixed(2)}</td>
            <td>{profit.toFixed(2)}</td>
            <td>{total.toFixed(2)}</td>
          </tr>
        </>
      );
    }

    const handelClick = async () => {
      await deleteInvestment(investment._id);
      window.location.reload();
    };

    investmentInfo.push(
      <>
        <tr key="total" className="flex justify-between text-start mt-4 mb-5">
          <td>Итого:</td>
          <td>{investment.amount}</td>
          <td>{totalAmount.toFixed(2)}</td>
          <td>{(totalAmount - investment.amount).toFixed(2)}</td>
          <td>{totalAmount.toFixed(2)}</td>
        </tr>
        <div className="w-full flex justify-center border-b-2 border-emerald-300">
        </div>
      </>
    );

    investmentRows.push(
      <>
       <div  className="flex justify-between p-3 items-center rounded border border-current flex">
         <h1 className="text-body-bold"> {investment.amount }$ от {investment.date} </h1>
         <Button
         className="bg-green-400 mb-4"
          type="button"
          onClick={toggleShow}
         >
          Просмотреть 
         </Button>
         <Button onClick={handelClick} className="bg-red-500 mb-4">
            Удалить 
          </Button>
        </div>

        {show ? (<section className="flex flex-col justify gap-3 duration-200">
          {investmentInfo}
          </section>): null
        }
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

export default TableInvestments;
