"use server";

import { revalidatePath } from "next/cache";
import Investment from "../models/Investment.model";
import User from "../models/user.model";
import { connectToDB } from "./mongoose";



interface Params {
  amount: number;
  investor: string;
  date: string;
  path: string;
  contract: string;
  perMonth: string;
}
interface UpdateParams {
  objectId:string
  amount: number;
  investor: string;
  date: string;
  path: string;
  contract: string;
  perMonth: string;
}

export async function createInvestment({
  amount,
  investor,
  date,
  contract,
  path,
  perMonth,
}: Params) {

  connectToDB();

  try {
    const createInvestment = await Investment.create({
      amount,
      investor,
      date,
      contract,
      perMonth,
    });

    await User.findByIdAndUpdate(investor, {
      $push: { investments: createInvestment._id },
    });
  } catch (error: any) {
    throw new Error(`Error creating Investment ${error.message}`);
  }
  revalidatePath(path);
}



export async function UpdateInvestment({
  objectId,
  amount,
  investor,
  date,
  contract,
  perMonth,
  path,
}: UpdateParams) {
  connectToDB();

  try {

    const createInvestment = await Investment.findOneAndUpdate(
      { _id: objectId },
     { amount,
      investor,
      date,
      contract,
      perMonth,}
    );

    await User.findByIdAndUpdate(investor, {
      $push: { investments: createInvestment._id },
    });
  } catch (error: any) {
    throw new Error(`Error updating Investment ${error.message}`);
  }
  revalidatePath(path);
}

export async function fetchInvestments(pageNumber = 1, pageSize = 100) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const investmentsQuery = Investment.find({
    parentId: { $in: [null, undefined] },
  })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "investor", model: User });

  const totalInvestmentsCount = await Investment.countDocuments({});

  const investments = await investmentsQuery.exec();

  const isNext = totalInvestmentsCount > skipAmount + investments.length;

  return { investments, isNext };
}

export async function deleteInvestment(id: string): Promise<void> {
  try {
    connectToDB();

    const investment = await Investment.findById(id);

    await Investment.deleteOne({ _id: id });

    if (!investment) {
      throw new Error("investment not found");
    }
  } catch (error: any) {
    throw new Error(`Failed to delete investment: ${error.message}`);
  }
}





export async function getInvestmentsInfo() {

  try {

    await connectToDB();
    const investmentsQuery = Investment.find({
      parentId: { $in: [null, undefined] },
    });
   
    const investments = await investmentsQuery.exec();
    
    let totalSum = 0;

    let perMonthCount = 0;
    let perMonthAmount= 0

    let perSixMonthCount = 0;
    let perSixMonthAmount = 0;

    const yearlyAmounts = investments.reduce((acc, investment) => {
      const year = new Date(investment.date).getFullYear();
      if (!acc[year]) {
        acc[year] = investment.amount;
      } else {
        acc[year] += investment.amount;
      }
      return acc;
    }, {});

    const yearlyData = Object.entries(yearlyAmounts).map(([year, amount]) => ({
      date: year,
      amountFullYear: amount,
    }));

    for (const investment of investments) {
      if (investment.perMonth === "PER_MONTH") {
        perMonthCount++;
        perMonthAmount += investment.amount
      } else if (investment.perMonth === "PER_SIX_MONTH") {
        perSixMonthCount++;
        perSixMonthAmount += investment.amount
      }
      totalSum += investment.amount;
    }
    const totalLength = investments.length;

    
    return { 
      investments, 
      totalSum, 
      totalLength, 
      perMonthCount, 
      perMonthAmount,  
      perSixMonthCount, 
      perSixMonthAmount,
      yearlyData,
    };
    
  } catch (error:any) {
    throw new Error(`Failed to get all investments info: ${error.message}`);
  }

}

export async function getInvestmentsByUserId(userId: string) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const investments = await Investment.find({ investor: userId });

    let totalSum = 0;

    let perMonthCount = 0;
    let perMonthAmount= 0

    let perSixMonthCount = 0;
    let perSixMonthAmount = 0;

    const yearlyAmounts = investments.reduce((acc, investment) => {
      const year = new Date(investment.date).getFullYear();
      if (!acc[year]) {
        acc[year] = investment.amount;
      } else {
        acc[year] += investment.amount;
      }
      return acc;
    }, {});

    const yearlyData = Object.entries(yearlyAmounts).map(([year, amount]) => ({
      date: year,
      amountFullYear: amount,
    }));

    for (const investment of investments) {
      if (investment.perMonth === "PER_MONTH") {
        perMonthCount++;
        perMonthAmount += investment.amount
      } else if (investment.perMonth === "PER_SIX_MONTH") { 
        perSixMonthCount++;
        perSixMonthAmount += investment.amount
      }
      totalSum += investment.amount;
    }
    const totalLength = investments.length;


    
    return { 
      investments, 
      totalSum, 
      totalLength, 
      perMonthCount, 
      perMonthAmount,  
      perSixMonthCount, 
      perSixMonthAmount,
      yearlyData,
    };    

  } catch (error: any) {
    throw new Error(`Failed to find investments by user id: ${error.message}`);
  }
}
