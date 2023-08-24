"use client"

import { findInvestmentsByUserId } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";
import UserTable from "../ui/UserTable";
import { Types } from "mongoose";

 

interface investments extends Document {
    id: string;
    amount: number;
    investor: Types.ObjectId;
    date: string;
    _id:string
  }
  


interface Props {
    objectId:string
}


export default function HomeTables({objectId}:Props) {


    const [investments, setInvestments] = useState<investments[]>([]);

    useEffect(() => {
      const fetchInvestments = async () => {
        try {
          const userInvestments = await findInvestmentsByUserId(objectId);
          setInvestments(userInvestments);
  
        } catch (error) {
          console.error("Failed to fetch user investments:", error);
        }
      };
  
      fetchInvestments();
    }, []);
    


  return (
    <>
      { investments.length === 0 ? (
        <p className="no-result">No investments found</p>
       ): (
        <div className="w-full">
        <UserTable  investments={investments} />
        </div>
       )}
        
    </>
  )
}
