"use client";

import RequestCard from "@/Components/cards/InvestmentsCard";
import ProfileHeader from "@/Components/shared/ProfileHeader";
import { Button } from "@/Components/ui/button";
import { getInvestmentsInfoByUserId } from "@/lib/actions/investment.actions";
import { fetchUserInfo } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Investment {
  _id: string;
  amount: number;
  date: Date;
  perMonth: string;
}
 
export default function page() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  if (!userId) return undefined;

  const objectId = userId.toString();

  const [userInfo, setUserInfo] = useState<any>(null);

  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    async function getUser() {
      try {
        const fetchedUser = await fetchUserInfo(objectId);
        setUserInfo(fetchedUser);
      } catch (error) {
        console.error(error);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    async function getUserInvestments() {
      try {
        const { investments } = await getInvestmentsInfoByUserId(objectId);
        setInvestments(investments);
      } catch (error) {
        console.error(error);
      }
    }
    getUserInvestments();
  }, []);

  return (
    <>
      <div className="flex w-full gap-5  border-b-2 border-stone-500 mb-5 pb-3 w-full">
        <Link href={"/Admin/Requests"}>
          <Button className="flex bg-primary-500 text-[14px] text-center p-4">
            Назад
          </Button>
        </Link>
        <h1 className="head-text ">Вывод средств</h1>
        <ProfileHeader objectId={objectId} />
      </div>

      {investments.map((investment) => (
          <RequestCard _id={investment._id} amount={investment.amount} date={investment.date} key={investment._id} perMonth={investment.perMonth} />
      ))}
    </>
  );
}
