


import ProfileHead from "@/Components/shared/ProfileHead";
import { Button } from "@/Components/ui/button";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useState } from "react";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");


  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    lastname: userInfo?.lastname || user?.lastName,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "" || user?.lastName,
    image: userInfo?.image || user.imageUrl,
    role: userInfo?.role || "USER",
    mail: userInfo?.mail,
    tel: userInfo?.tel,
    city: userInfo?.city,
    passport_series: userInfo?.passport_series,
    passport_number: userInfo?.passport_number,
    cardNumber: userInfo?.cardNumber,
  };

  return (
    <div className="text-light-1">
        <ProfileHead
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
    </div>
  );
}

export default Page;
