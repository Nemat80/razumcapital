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
import { deleteInvestment } from "@/lib/actions/investment.actions";
import { saveAs } from "file-saver";
import Modal from "@/Components/Modal/Modal";
import { Types } from "mongoose";
import UpdateInvestmentForm from "../forms/UpdateInvestmentForm";

type InvestmentData = {
  id: string;
  amount: number;
  date: string;
  _id: string;
  contract: string;
  perMonth: string;
  investor: Types.ObjectId;
};

type TableProps = {
  investments: InvestmentData[];
};

const TableInvestments: React.FC<TableProps> = ({ investments }) => {
  const renderInvestmentRows = (investment: InvestmentData) => {
    const [show, setShow] = useState(false);
    const toggleShow = () => setShow(!show);

    const handleDownload = async () => {
      try {
        const response = await fetch(investment.contract);
        const blob = await response.blob();
        saveAs(blob, `договор_от_${investment.date}_${investment.amount}$`);
      } catch (error) {
        console.error("Ошибка при загрузке файла", error);
      }
    };

    const handelClick = async () => {
      await deleteInvestment(investment._id);

      window.location.reload();
    };

    const user = String(investment.investor);

    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
      setShowModal(true);
    };

    const closeModal = () => {
      setShowModal(false);
    };

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

    investmentInfo.push(
      <>
        <tr key="total" className="flex justify-between text-start mt-4 mb-5">
          <td>Итого:</td>
          <td>{investment.amount}</td>
          <td>{totalAmount.toFixed(2)}</td>
          <td>{(totalAmount - investment.amount).toFixed(2)}</td>
          <td>{totalAmount.toFixed(2)}</td>
        </tr>
        <div className="w-full flex justify-center border-b-2 border-emerald-300"></div>
      </>
    );

    investmentRows.push(
      investment.perMonth === "PER_MONTH" ? (
        <>
          <div className="flex  p-4 items-center justify-between rounded border border-current">
            <div className="flex-col border-r border-current pr-3">
              <legend>Ежемесячная Ивестиция</legend>
              <p>
                {investment.amount} $ от {investment.date}{" "}
              </p>
            </div>

            <div className="flex-col border-r border-current pr-3">
              <legend className="text-[14px]">Процент Ежемесячно</legend>
              <p className="text-[15px]">
                {(investment.amount * 0.05).toFixed(2)} $
              </p>
            </div>

            <div className="flex-col border-r border-current pr-3">
              <legend className="text-[14px]">Прибль за 3 года</legend>
              <p>{(investment.amount * 0.05 * 33).toFixed(2)} $</p>
            </div>

            {investment.contract === "" ? (
                <>
                  <div className="flex flex-col border-1 border-stone-300 gap-2">
                    <p className="text-center">Без договора</p>
                    <Button onClick={openModal} className="bg-blue">
                      Изменить
                    </Button>
                    {showModal && (
                      <Modal onClose={closeModal}>
                        <UpdateInvestmentForm
                          objectId={investment._id}
                          userId={user}
                          amount={investment.amount}
                          date={investment.date}
                          contract={investment.contract}
                          perMonth={investment.perMonth}
                        />
                      </Modal>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  <Button
                    onClick={handleDownload}
                    className="bg-yellow-400 mb-2"
                  >
                    Скачать договор
                  </Button>
                  <Button onClick={openModal} className="bg-blue">
                    Изменить
                  </Button>
                  {showModal && (
                    <Modal onClose={closeModal}>
                      <UpdateInvestmentForm
                        objectId={investment._id}
                        userId={user}
                        amount={investment.amount}
                        date={investment.date}
                        contract={investment.contract}
                        perMonth={investment.perMonth}
                      />
                    </Modal>
                  )}
                </div>
              )}
            <Button onClick={handelClick} className="bg-red-500 mb-2 ">
              Удалить
            </Button>
          </div>

          {show ? (
            <section className="flex flex-col justify gap-3 duration-200">
              {investmentInfo}
            </section>
          ) : null}
        </>
      ) : (
        <>
          <div className="flex gap-2 justify-between w-full  p-3 items-center rounded border border-current ">
            <div className="border-r border-current pr-3">
              <legend className="text-[15px]">Договор</legend>
              <p className="text-body-bold">
                {investment.amount}$ от {investment.date}
              </p>
            </div>

            <div className="flex-col border-r border-current pr-3">
              <legend className="text-[14px]">Прибль за 3 года</legend>
              <p> {totalAmount.toFixed(2)}$ </p>
            </div>

            <div className="flex gap-2 items-center">
              <Button
                className="bg-green-400 mb-2"
                type="button"
                onClick={toggleShow}
              >
                Просмотреть
              </Button>

              {investment.contract === "" ? (
                <>
                  <div className="flex flex-col border-1 border-stone-300 gap-2">
                    <p className="text-center">Без договора</p>
                    <Button onClick={openModal} className="bg-blue">
                      Изменить
                    </Button>
                    {showModal && (
                      <Modal onClose={closeModal}>
                        <UpdateInvestmentForm
                          objectId={investment._id}
                          userId={user}
                          amount={investment.amount}
                          date={investment.date}
                          contract={investment.contract}
                          perMonth={investment.perMonth}
                        />
                      </Modal>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  <Button
                    onClick={handleDownload}
                    className="bg-yellow-400 mb-2"
                  >
                    Скачать договор
                  </Button>
                  <Button onClick={openModal} className="bg-blue">
                    Изменить
                  </Button>
                  {showModal && (
                    <Modal onClose={closeModal}>
                      <UpdateInvestmentForm
                        objectId={investment._id}
                        userId={user}
                        amount={investment.amount}
                        date={investment.date}
                        contract={investment.contract}
                        perMonth={investment.perMonth}
                      />
                    </Modal>
                  )}
                </div>
              )}
              <Button onClick={handelClick} className="bg-red-500 mb-2">
                Удалить
              </Button>
            </div>
          </div>

          {show ? (
            <section className="flex flex-col justify gap-3 duration-200">
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

export default TableInvestments;
