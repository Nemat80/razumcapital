"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import RequestCard from "./RequestCard";

interface InvestmentProps {
  _id: string;
  amount: number;
  date: Date;
  perMonth: string;
}

export default function InvestmentsCard({
  _id,
  amount,
  date,
  perMonth,
}: InvestmentProps) {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  const investType = perMonth === "PER_SIX_MONTH" ? "С реинвестицией" : "Без реинвестиции"

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  let cycles = 0;

  if (perMonth === "PER_SIX_MONTH") {
    for (let year = currentYear; year < currentYear + 3; year++) {
      for (let month = 0; month < 12; month++) {
        if (month !== 11) {
          cycles++;
        }
      }
    }
  }else {
    return null
  }

  return (
    <div key={_id} className="text-light-1 m-2 border-b py-2">
      <div className="flex justify-between items-center w-full">
        <ul>
          <li>Инвестиция от: {new Date(date).toLocaleDateString()} </li>
          <li>Сумма: {amount}</li>
          <li>Тип: {investType}</li>
        </ul>
        <Button onClick={toggleShow}>История</Button>
      </div>

      {show ? (
        <ul className="w-full flex flex-col border-t mt-2">
            <RequestCard key={_id} _id={_id} amount={amount} date={date} perMonth={perMonth}  />
        </ul>
      ) : null}
    </div>
  );
}
