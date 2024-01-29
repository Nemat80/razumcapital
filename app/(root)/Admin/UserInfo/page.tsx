"use client";

import {  useSearchParams } from "next/navigation";
import { Button } from "@/Components/ui/button";

import { usePathname } from "next/navigation";

import React, { useEffect, useState } from "react";
import {
  fetchUserInfo,
  findInvestmentsByUserId,
} from "@/lib/actions/user.actions";
import { Document, Types } from "mongoose";
import TableInvestments from "@/Components/ui/Table";
import ProfileHeader from "@/Components/shared/ProfileHeader";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { userTabs } from "@/constants";
import Image from "next/image";
import UserProfile from "@/Components/shared/UserProfile";
import AccountProfile from "@/Components/forms/AccoutnProfile";
import CreateInvestmentForm from "@/Components/forms/CreateInvestmentForm";




interface investments extends Document {
  id: string;
  amount: number;
  investor: Types.ObjectId;
  date: string;
  _id: string;
  contract: string;
  perMonth: string;
}




export default function UserInfo() {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = searchParams.get("id");
  if (!user) return null;

  const objectId = String(user);

  const [userInfo, setUserInfo] = useState<any>(null);

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

  const [edit, setEdit] = useState(false);

  const handleClickEdit = () => {
    setEdit(!edit);
  };

  const userDataEdit = {
    id: userInfo?.id,
    objectId: userInfo?._id,
    lastname: userInfo?.lastname,
    name: userInfo?.name,
    bio: userInfo?.bio || "",
    image: userInfo?.image,
    role: userInfo?.role || "USER",
    mail: userInfo?.mail,
    tel: userInfo?.tel,
    city: userInfo?.city,
    passport_series: userInfo?.passport_series,
    passport_number: userInfo?.passport_number,
    cardNumber: userInfo?.cardNumber,
  };

  const [investments, setInvestments] = useState<investments[]>([]);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const userInvestments = await findInvestmentsByUserId(user);
        setInvestments(userInvestments);
      } catch (error) {
        console.error("Failed to fetch user investments:", error);
      }
    };

    fetchInvestments();
  }, []);


  return (
    <>
      <div className="flex flex-col  justify-center items-center">
        <div className="flex items-center gap-4 border-b-2 border-stone-500  mb-5 pb-3 w-full">
          <Button className="bg-primary-500" onClick={router.back}>
            Назад
          </Button>
          <h1 className="head-text">Профиль</h1>
          <ProfileHeader objectId={objectId} />
        </div>
        <div className="mt-9 w-full">
          <Tabs defaultValue="investments" className="w-full">
            <TabsList className="tab">
              {userTabs.map((tab) => (
                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <p className="max-sm:hidden">{tab.label}</p>

                  {tab.label === "Инвестиции" && (
                    <p className="ml-1 rounded-sm bg-light-3 px-2 py-1 !text-tiny-medium text-light-2">
                      {investments.length}
                    </p>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="investments" className="w-full text-light-1">
              <CreateInvestmentForm
                user={user}
                objectId={objectId}
                pathname={pathname}
              />

              {investments.length === 0 ? (
                <p className="no-result">Инвестиций не найдено</p>
              ) : (
                <div className="w-full">
                  <TableInvestments investments={investments} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="user" className="w-full text-light-1">
              {userInfo ? (
                <div className="flex flex-col gap-5 mt-9 bg-dark-2 p-10">
                  <UserProfile
                    imgUrl={userInfo.image}
                    lastname={userInfo.lastname}
                    name={userInfo.name}
                    bio={userInfo.bio}
                    mail={userInfo.mail}
                    tel={userInfo.tel}
                    city={userInfo.city}
                    series={userInfo.passport_series}
                    number={userInfo.passport_number}
                    cardNumber={userInfo.cardNumber}
                  />
                  <Button className="bg-blue" onClick={handleClickEdit}>
                    Изменить профиль
                  </Button>
                  {edit ? <AccountProfile user={userDataEdit} /> : null}
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
