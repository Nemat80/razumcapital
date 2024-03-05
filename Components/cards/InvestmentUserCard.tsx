"use client"

import { useEffect, useState } from "react";
import { Button } from "../ui/button";

import Link from "next/link";
import {  getInvestmentsInfoByUserId } from "@/lib/actions/investment.actions";


interface Props {
  id: string;
  name: string;
  lastName: string;
  imgUrl: string;
  bio:string;
}


export const InvestmentUserCard = ({
  id,
  name,
  lastName,
  bio
}: Props) => {

const stringId = id.toString()

const [investments, setInvestments] = useState<
| {
    investments: Omit<any, never>[];
  }
| undefined
>();




useEffect(() => { 
  async function getUserInvestments() {
    try {
      const UserInvestments = await getInvestmentsInfoByUserId(id)
      setInvestments(UserInvestments)
    } catch (error) {
      console.error(error);
    }
  }

  getUserInvestments();
}, []);


 


  return (
    <article className="user-card border-2 rounded-xl border-stone-300 p-4 responsive_text text-light-1 font-bold" key={stringId}>
      <div className="user-card_avatar">
        <div className="flex gap-4 text-ellipsis">
        <p className="">{lastName}</p>
          <h4 className="">{name}</h4>
        </div>
        <div className="flex gap-4 text-ellipsis">
          <h4 className="">{bio}</h4> 
        </div>
        <div className="flex gap-4 text-ellipsis">
          <h4 className="">Статус</h4> 
        </div>
      </div> 
      <Link href={{ pathname: '/Requests/UserRequest', query: { id } }}>
      <Button className="community-card_btn">
        Инвестиции
      </Button>
      </Link>

    </article>
  );
};

export default InvestmentUserCard;
