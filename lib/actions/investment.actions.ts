"use server";

import { revalidatePath } from "next/cache";
import Investment from "../models/Investment.model";
import User from "../models/user.model";
import { connectToDB } from "./mongoose";
import { utapi } from "uploadthing/server";

interface Params {
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
  try {
    connectToDB();

    const createInvestment = await Investment.findOneAndUpdate({
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
    throw new Error(`Error creatgin Investment ${error.message}`);
  }
  revalidatePath(path);
}

export async function fetchInvestments(pageNumber = 1, pageSize = 20) {
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
