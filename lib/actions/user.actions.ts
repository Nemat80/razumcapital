"use server";


import { FilterQuery, SortOrder, Document, Types } from "mongoose";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "./mongoose";
import {UserValidation } from "../validations/user"
import Investment from "../models/Investment.model";

interface Params {
  userId: string;
  lastname: string;
  name: string;
  bio:string;
  image:string;
  path:string;
  role: string;
  mail:string;
  tel:string;
  city:string;
  passport_series:string;
  passport_number:string;
  cardNumber:string;
}

interface Investment extends Document {
  amount: number;
  investor: Types.ObjectId;
  date: string;
}



export async function fetchUser(userId: string) {

  try {
    connectToDB();


    return await User.findOne( { id: userId } )

  } catch (error: any) {

    throw new Error(`Failed to fetch user: ${error.message}`);
    
  }
}


export async function fetchUserInfo(userId: string) {

  try {
    connectToDB();


    return await User.findOne( { _id: userId, } )

  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}




export async function updateUser({
  userId,
  lastname,
  name,
  bio,
  image ,
  path ,
  role,
  mail,
  tel,
  city,
  passport_series,
  passport_number,
  cardNumber,
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId, },
      {
        lastname,
        name,
        bio,
        image,
        onboarded: true,
        role,
        mail,
        tel,
        city,
        passport_series,
        passport_number,
        cardNumber,
      },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
  investments?:any;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },  // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}



export const getAllUsers = async () => {
  const users = await User.find();
  return users.map((user) => UserValidation.parse(user.toJSON()));
};





export async function findInvestmentsByUserId(userId: string) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const investments = await Investment.find({ investor: userId });

    return investments;
  } catch (error: any) {
    throw new Error(`Failed to find investments: ${error.message}`);
  }
}
