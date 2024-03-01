"use server";

import IRequest from "../models/Requests.model";
import { connectToDB } from "./mongoose";
import Investment from "../models/Investment.model";


interface UpdatedParams {
  objectId:string;
  investmentId:string;
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
      $push: { irequests: createRequest._id }
    })


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
     { investmentId,
      index,
      date,
      method,
      initials,
      amount,
      status,
    }
    );

    await Investment.findByIdAndUpdate(investmentId, {
      $push: { irequests: updatedRequst._id }
    });
  } catch (error: any) {
    throw new Error(`Error updating Requst ${error.message}`);
  }
}





  export async function getRequestsByInvestmentId(investmentId: string) {
    try {


      const requests = await IRequest.find({ investmentId: investmentId });

      return requests
  
    } catch (error: any) {
      throw new Error(`Failed to find requests info by user id: ${error.message}`);
    }
  }


  export async function createMultipleRequests(paramsArray: Params[]) {
    // Используем Promise.all для выполнения всех асинхронных операций параллельно
    await Promise.all(
      // Маппируем каждый элемент массива в промис, который вызывает функцию createRequest с соответствующими параметрами
      paramsArray.map((params) => createRequest(params))
    );
    // Возвращаем сообщение об успешном создании объектов IRequest
    return "Successfully created 6 IRequest objects";
  }