"use_client";

import { useState } from "react";
import Modal from "../Modal/Modal";
import { Button } from "../ui/button";
import CreateRequestForm from "../forms/CreateRequestForm";

interface InvestmentProps {
  _id: string;
  amount: number;
  date: Date;
  perMonth: string;
}

export default function RequestCard({
  _id,
  date,
  perMonth,
}: InvestmentProps) {
  const currentDate = new Date();

  const datesArray: Date[] = [];

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (perMonth === "PER_SIX_MONTH") {
    const dateAfter6Months: Date = new Date(date);
    dateAfter6Months.setMonth(dateAfter6Months.getMonth() + 6);
    datesArray.push(dateAfter6Months);

    const dateAfter11Months: Date = new Date(dateAfter6Months);
    dateAfter11Months.setMonth(dateAfter11Months.getMonth() + 5);
    datesArray.push(dateAfter11Months);

    const dateAfter17Months: Date = new Date(dateAfter11Months);
    dateAfter17Months.setMonth(dateAfter17Months.getMonth() + 6);
    datesArray.push(dateAfter17Months);

    const dateAfter22Months: Date = new Date(dateAfter17Months);
    dateAfter22Months.setMonth(dateAfter22Months.getMonth() + 5);
    datesArray.push(dateAfter22Months);

    const dateAfter28Months: Date = new Date(dateAfter22Months);
    dateAfter28Months.setMonth(dateAfter28Months.getMonth() + 6);
    datesArray.push(dateAfter28Months);

    const dateAfter33Months: Date = new Date(dateAfter28Months);
    dateAfter33Months.setMonth(dateAfter33Months.getMonth() + 5);
    datesArray.push(dateAfter33Months);
  } else {
    for (let i = 0; i < 33; i++) {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + i);
      datesArray.push(newDate);
    }
  }

  const filteredDates = datesArray.filter(
    (date) => date.getTime() <= currentDate.getTime()
  );

  return (
    <div className="text-ligh-1 mt-3 mb-1 flex flex-col gap-2">
      {filteredDates.map((date, index) => (
        <div key={index} className="flex border rounded-md p-2 justify-between">
          <div className="flex flex-col">
            <div className="flex flex-col">Карта</div>
            <div className="">1234567890123456</div>
          </div>
          <div className="flex flex-col">
            <div className="">{date.toLocaleDateString()}</div>
            <div className="">
              <Button onClick={openModal} className="bg-blue">
                Добавить
              </Button>
              {showModal && 
              <Modal onClose={closeModal}>
                  <CreateRequestForm investment={_id} id={index} date={date.toString().slice(0, 10)}/>
              </Modal>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
