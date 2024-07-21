"use server";

import IRequest from "../models/Requests.model";
import { connectToDB } from "./mongoose";
import Investment from "../models/Investment.model";
import { getInvestmentsInfoByUserId } from "./investment.actions";

interface UpdatedParams {
  objectId: string;
  investmentId: string;
  index: number;
  date: Date;
  method: string;
  initials: string;
  amount: number;
  status: string;
}

interface Params {
  investmentId: string;
  index: number;
  method: string;
  initials: string;
  amount: number;
  date: Date;
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
    const createRequest = await IRequest.create({
      investmentId,
      index,
      method,
      initials,
      amount,
      date,
      status,
    });

    await Investment.findByIdAndUpdate(investmentId, {
      $push: { irequests: createRequest._id },
    });
  } catch (error: any) {
    throw new Error(`Error creating Requests ${error.message}`);
  }
}

export async function UpdateRequests({
  objectId,
  investmentId,
  index,
  method,
  initials,
  amount,
  date,
  status,
}: UpdatedParams) {
  connectToDB();

  try {
    const updatedRequst = await IRequest.findOneAndUpdate(
      { _id: objectId },
      { investmentId, index, date, method, initials, amount, status }
    );

    await Investment.findByIdAndUpdate(investmentId, {
      $push: { irequests: updatedRequst._id },
    });
  } catch (error: any) {
    throw new Error(`Error updating Requst ${error.message}`);
  }
}

export async function getRequestsByInvestmentId(investmentId: string) {
  try {
    connectToDB();

    const requests = await IRequest.find({ investmentId: investmentId });

    return requests;
  } catch (error: any) {
    throw new Error(
      `Failed to find requests info by user id: ${error.message}`
    );
  }
}

export async function createMultipleRequests(paramsArray: Params[]) {
  await Promise.all(paramsArray.map((params) => createRequest(params)));
  return "Successfully created 6 IRequest objects";
}











export async function fetchRequestsNotifications(userId: string): Promise<string> {
  try {
    const { investments } = await getInvestmentsInfoByUserId(userId);

    // Выполняем запросы параллельно
    const requestsPromises = investments.map(investment => getRequestsByInvestmentId(investment._id));
    const requestsResults = await Promise.allSettled(requestsPromises);

    // Проверяем, все ли запросы одобрены хотя бы для одного инвестиционного объекта
    const anyInvestmentHasApprovedRequests = requestsResults.some(result => {
      if (result.status === 'fulfilled') {
        const requests = result.value;
        return requests.some(request => request.status === 'approved');
      }
      return false;
    });

    return anyInvestmentHasApprovedRequests ? 'green' : 'orange';
  } catch (error) {
    console.error('Error fetching requests notifications:', error);
    return 'white';
  }
}