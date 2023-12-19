"use client";

import { getInvestmentsByUserId } from "@/lib/actions/investment.actions";
import { useEffect, useState } from "react";

interface Props {
  objectId: string;
}

export default function UserBalanceStat({ objectId }: Props) {
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
        const investments = await getInvestmentsByUserId(objectId);
        setInvestments(investments);
      } catch (error) {
        console.error(error);
      }
    }
    usersCount();
  }, []);

  const totalProfit = (investments?.perMonthAmount ?? 0) * 0.05 * 33;
  let totalAmountPerSixMonth;

  if (investments) {
    for (let i = 0; i < 33; i++) {
      const investmentAmount =
        investments.perSixMonthAmount * Math.pow(1.05, i);
      const profit = investmentAmount * 0.05;
      const total = investmentAmount + profit;
      totalAmountPerSixMonth = total.toFixed(2);
    }
  }

  return (
    <div className="flex flex-row flex-wrap gap-2 bg-dark-2 rounded-md p-4 items-center">
      <div className="flex flex-col justify-between gap-4 items-start flex-1">
        <p>Общая cумма инвестиций</p>
        <p className="font-bold text-[28px]">${investments?.totalSum}</p>
      </div>
      <div className="flex flex-col justify-between gap-2 items-start flex-1">
        <p>Ожидаемый доход от ежемесячных инвестиций</p>
        <p className="font-bold text-[28px]">${totalProfit}</p>
      </div>
      <div className="flex flex-col justify-between gap-2 items-start flex-1">
        <p>Ожидаемый доход от ежемесячных инвестиций</p>
        <p className="font-bold text-[28px]"> ${totalAmountPerSixMonth}</p>
      </div>
    </div>
  );
}
