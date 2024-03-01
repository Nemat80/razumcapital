"use_client";

import { useEffect, useState } from "react";
import UpdateRequestForm from "../forms/UpdateRequestForm";
import {
  createMultipleRequests,
  getRequestsByInvestmentId,
} from "@/lib/actions/request.action";
import { Button } from "../ui/button";

interface InvestmentProps {
  _id: string;
  amount: number;
  date: Date;
  perMonth: string;
}

interface Requests {
  investmentId: string;
  _id: string;
  index: number;
  date: string;
  method: string;
  initials: string;
  amount: number;
  status: string;
}

interface PaymentParams {
  investmentId: string;
  index: number;
  method: string;
  initials: string;
  amount: number;
  date: Date;
  status: string;
}

export default function RequestCard({ _id, date, perMonth }: InvestmentProps) {
  const currentDate = new Date();
  const [loading, setLoading] = useState<boolean>(false);

  const [requests, setRequests] = useState<Requests[]>([]);
  const [payments, setPayments] = useState<PaymentParams[]>([]);

  useEffect(() => {
    function createRequestsArray(
      _id: string,
      date: Date,
      perMonth: string
    ): PaymentParams[] {
      if (perMonth === "PER_SIX_MONTH") {
        let payments: PaymentParams[] = [];
        let months: number[] = [6, 11, 17, 22, 28, 33];
        for (let index = 0; index < 6; index++) {
          let payment: PaymentParams = {
            investmentId: _id,
            index: index,
            date: new Date(date),
            method: "empty",
            initials: "empty",
            amount: 0,
            status: "empty",
          };
          payment.date.setMonth(payment.date.getMonth() + months[index]);

          payments.push(payment);
        }

        setPayments(payments);

        return payments;
      } else {
        let payments: PaymentParams[] = [];
        let months: number[] = [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
        ];
        for (let index = 0; index < 33; index++) {
          let payment: PaymentParams = {
            investmentId: _id,
            index: index,
            date: new Date(date),
            method: "empty",
            initials: "empty",
            amount: 0,
            status: "empty",
          };
          payment.date.setMonth(payment.date.getMonth() + months[index]);
          payments.push(payment);
        }
        setPayments(payments);

        return payments;
      }
    }

    createRequestsArray(_id, date, perMonth);
  }, []);


  const handleCreateRequests = async () => {
    setLoading(true);

    await createMultipleRequests(payments);
  };

  useEffect(() => {
    async function fetchInvestmentsRequests() {
      try {
        const investmentRequests = await getRequestsByInvestmentId(_id);
        setRequests(investmentRequests);
      } catch (error) {}
    }

    fetchInvestmentsRequests();
  }, [handleCreateRequests]);

  let options = {
    day: "numeric" as const,
    month: "numeric" as const,
    year: "numeric" as const,
  };
  const updatedRequests = requests
    .map((item, index) => ({ ...item, ...requests[index] }))
    .filter(({ date }) => new Date(date).getTime() <= currentDate.getTime())
    .map(({ date, ...rest }) => ({
      ...rest,
      date: new Date(date).toLocaleDateString("ru-RU", options),
    }));

  const updatedPayments = payments
    .map((item, index) => ({ ...item, ...payments[index] }))
    .filter(({ date }) => new Date(date).getTime() <= currentDate.getTime())
    .map(({ date, ...rest }) => ({
      ...rest,
      date: new Date(date).toLocaleDateString("ru-RU", options),
    }));
  return (
    <>
      {requests.length === 0 ? (
        <>
          <div className="text-ligh-1 mt-3 mb-1 flex flex-col-reverse gap-2">
            {loading && (
              <Button className="animate-pulse">Создать выводы</Button>
            )}
            {!loading && (
              <Button onClick={handleCreateRequests}>Создать выводы</Button>
            )}

            {updatedPayments.map((request) => (
              <div
                key={request.index}
                className="flex bg-dark-2 text-white font-medium rounded p-2 justify-between"
              >
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col">Метод: нету</div>
                  <div className="">Инициалы: нету</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="">Цикл: {request.index}</div>
                  <div className="">
                    <div className="">{request.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-ligh-1 mt-3 mb-1 flex flex-col-reverse gap-2">
            {updatedRequests.map((request) => (
              <div
                key={request.index}
                className={`flex rounded p-2 justify-between ${
                  request.status === "empty" || "" ? `bg-dark-2` : `bg-zinc-600`
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="">
                    {request.method === "cash" && (
                      <img
                        src="/assets/cash.svg"
                        width={40}
                        height={40}
                        alt="cash icon"
                      />
                    )}
                    {request.method === "crypto" && (
                      <img
                        src="/assets/bitcoin.svg"
                        width={40}
                        height={40}
                        alt="bitcoin icon"
                      />
                    )}
                    {request.method === "card" && (
                      <img
                        src="/assets/card.svg"
                        width={40}
                        height={40}
                        alt="card icon"
                      />
                    )}
                    {request.method === "empty" || "" && (
                      <img
                        className="bg-white rounded-md p-1"
                        src="/assets/empty.svg"
                        width={40}
                        height={40}
                        alt="empty icon"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      {request.method === "cash" && "Наличными"}
                      {request.method === "card" && "На карту"}
                      {request.method === "crypto" && "Криптокошелёк"}
                      {request.method === "empty" || "" && "Пусто"}
                    </div>

                    <div className="">
                      {request.initials === "empty" || ""
                        ? ""
                        : `${request.initials}`}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex gap-2">
                    {request.date}
                        <UpdateRequestForm 
                        _id={request._id}
                        status={request.status}
                        method={request.method}
                        initials={request.initials}
                        amount={request.amount}
                        investment={request.investmentId}
                        index={request.index}
                        date={new Date(request.date)}
                        />
                  </div>
                  <div
                    className={`flex items-center gap-2  font-bold ${
                      request.status === "approved"
                        ? "text-green-400"
                        : request.status === "rejected"
                        ? "text-rose-600"
                        : request.status === "pending"
                        ? "text-orange-500"
                        : "text-gray-50"
                    }`}
                  >
                    <p>- {request.amount}</p>
                    <p>
                      {request.status === "approved" && (
                        <img
                          src="/assets/approved.svg"
                          width={30}
                          height={30}
                          alt="approved icon"
                        />
                      )}
                      {request.status === "rejected" && (
                        <img
                          src="/assets/rejected.svg"
                          width={30}
                          height={30}
                          alt="rejected icon"
                        />
                      )}
                      {request.status === "pending" && (
                        <img
                          src="/assets/pending.svg"
                          width={25}
                          height={25}
                          alt="pending icon"
                        />
                      )}
                      {request.status === "empty" || "" && (
                        <img
                          className="bg-white rounded-md p-1"
                          src="/assets/empty.svg"
                          width={25}
                          height={25}
                          alt="empty icon"
                        />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
