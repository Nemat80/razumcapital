"use server";

import Request from "../models/Requests.model";
import { connectToDB } from "./mongoose";
import Investment from "../models/Investment.model";

interface Params {
  investmentId: string;
  index: number;
  method: string;
  initials: string;
  amount: number;
  date: string;
  status: string;
}

export async function createRequest({ 
  investmentId,
  index,
  method,
  initials,
  amount,
  date,
  status,
}: Params) {

  connectToDB();
  try {
    const createRequest = await Request.create({
      investmentId,
      index,
      method,
      initials,
      amount,
      date,
      status,
    });

    await Investment.findByIdAndUpdate(investmentId, {
      $push: { requests: createRequest._id }
    })


  } catch (error: any) {
    throw new Error(`Error creating Requests ${error.message}`);
  }
}
