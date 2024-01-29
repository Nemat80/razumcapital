
import Pagination from "@/Components/shared/Pagination";
import SearchInvestments from "@/Components/shared/SearchInvestments";
import { Button } from "@/Components/ui/button";
import { fetchUser, fetchUsersRequests } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (userInfo.role === "USER") redirect("/")


  const result = await fetchUsersRequests({
    userId: user.id,
    searchString: searchParams?.q || "",
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 20,
  });



  if (userInfo?.role === "ADMIN") {
    return (
        <>
      <div className="flex w-full gap-3 border-b-2 border-stone-500 mb-5 pb-3 w-full">
         <Link href={"/Admin"}>
              <Button className="flex bg-primary-500 text-[14px] text-center p-4">
                Назад 
              </Button>
            </Link>
        <h1 className="head-text ">Вывод средств</h1>
      </div>
      <SearchInvestments  userId={user.id} searchParams={searchParams} />
      <Pagination
            path="Admin/Requests"
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={result.isNext}
          />
      </>
    );
  }
}
