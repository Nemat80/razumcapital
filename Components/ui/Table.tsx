import React from "react";
import { Button } from "./button";
import {deleteInvestment} from "@/lib/actions/investment.actions";


type InvestmentData = {
  id: string;
  amount: number;
  date: string;
  _id:string
};

type TableProps = {
  investments: InvestmentData[];
};

const TableInvestments: React.FC<TableProps> = ({ investments }) => {
  const renderInvestmentRows = (investment: InvestmentData) => {


    const investmentRows = [];
    let totalAmount = 0;

    for (let i = 0; i < 33; i++) {
      const currentDate = new Date(investment.date);
      currentDate.setMonth(currentDate.getMonth() + i);
      const endDate = currentDate.toISOString().slice(0, 10);

      const investmentAmount = investment.amount * Math.pow(1.05, i);
      const profit = investmentAmount * 0.05;
      const total = investmentAmount + profit;

      if (i === 0) {
        investmentRows.push (
          <thead className="w-full">
          <tr className="flex justify-between py-1 px-4 rounded-xl bg-zinc-600">
            <th>Дата</th>
            <th>Инвестиция</th>
            <th>Прибль</th>
            <th>Итого</th>
          </tr>
        </thead>
        )
      }
      

      totalAmount = total;
      

      investmentRows.push(
        <tr key={i} className="flex justify-between">
          <td>{endDate}</td>
          <td className="">{investmentAmount.toFixed(2)}</td>
          <td>{profit.toFixed(2)}</td>
          <td>{total.toFixed(2)}</td>
        </tr>
      );
    }
    

    const handelClick = async () => {
         await deleteInvestment(investment._id)
         window.location.reload()
    }

     investmentRows.push(
        <>
      <tr key="total" className="flex justify-between text-start mt-4 mb-5">
        <td>Итого:</td>
        <td>{totalAmount.toFixed(2)}</td>
        <td>{(totalAmount - investment.amount).toFixed(2)}</td>
        <td>{totalAmount.toFixed(2)}</td>
        
      </tr>
      <div className="w-full flex justify-center border-b-2 border-emerald-300">
      <Button onClick={handelClick} className="bg-red-500 mb-4">
                Удалить инвестицию
            </Button>
            </div>
      </>
    );

   

    return investmentRows;
  };

  return (
    <table className="w-full text-light-1 flex flex-col bg-zinc-900 rounded-xl mt-5 px-5 py-5">
      <tbody className="mt-3 flex flex-col gap-3 ">
        {investments.map((investment) => renderInvestmentRows(investment))}
      </tbody>
    </table>
  );
};

export default TableInvestments;