"use client";

import { fetchRequestsNotifications } from "@/lib/actions/request.action";
import Image from "next/image";
import Link from "next/link";
import React, {  useEffect, useMemo, useState } from "react";

interface Props {
  id: string;
  name: string;
  lastName: string;
  imgUrl: string;
  bio: string;
}

const UserCard = React.memo(({ id, imgUrl, name, lastName, bio }: Props) => {
  const stringId = id.toString();

  const [color, setColor] = useState("orange") 


  // const [color, setColor] = useState(() => {
  //   const cachedColor = sessionStorage.getItem('color');
  //   try {
  //     return cachedColor !== null ? JSON.parse(cachedColor) : "";
  //   } catch (error) {
  //     console.error("Ошибка разбора JSON:", error)
  //     return "";
  //   }
  // });
  
  // useEffect(() => {
  //   async function fetchColor() {
  //     try {
  //       const color = await fetchRequestsNotifications(stringId);
  //       setColor(color);
  //     } catch (error) {
  //       // Обработка ошибок при запросе цвета
  //     }
  //   }
  
  //   fetchColor();
  // }, [stringId]); // Зависимость теперь от stringId



  
  return (
    <Link href={{ pathname: "/UserInfo", query: { id } }}>
      <article
        className="user-card ease-in-out duration-200 bg-dark-2 hover:bg-gray-500 rounded-xl border-stone-300 p-4 responsive_text text-light-1 font-bold"
        key={stringId}
      >
        <div className="user-card_avatar">
          <Image
            src={imgUrl}
            alt="logo"
            width={48}
            height={48}
            className="rounded-full"
          />

          <div className="">
            {color === "white" && (
              <div className="w-5 h-5 rounded-full bg-white-50">
                <div className="w-5 h-5 rounded-full bg-white-50 animate-ping"></div>
              </div>
            )}
            {color === "orange" && (
              <div className="w-5 h-5 rounded-full bg-amber-600">
                <div className="w-5 h-5 rounded-full bg-amber-600 animate-ping"></div>
              </div>
            )}
            {color === "green" && (
              <div className="w-5 h-5 rounded-full bg-green-500">
                <div className="w-5 h-5 rounded-full bg-green-500 "></div>
              </div>
            )}
          </div>

          <div className="flex gap-4 text-ellipsis">
            <p className="">{lastName}</p>
            <h4 className="">{name}</h4>
          </div>
          <div className="flex gap-4 text-ellipsis">
            <h4 className="">{bio}</h4>
          </div>
        </div>
      </article>
    </Link>
  );
});

export default UserCard;
