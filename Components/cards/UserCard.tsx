"use client"
import Image from "next/image";
import { Button } from "../ui/button";

import Link from "next/link";


interface Props {
  id: string;
  name: string;
  lastName: string;
  imgUrl: string;
  personType: string;
  bio:string;
}


const  UserCard =   ({
  id,
  imgUrl,
  name,
  lastName,
  personType,
  bio
}: Props) => {




  const stringId = id.toString();


  return (
    <article className="user-card border-2 rounded-xl border-stone-300  p-4" key={stringId}>
      <div className="user-card_avatar">
        <Image
          src={imgUrl}
          alt="logo"
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex gap-4 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-base-semibold text-light-1">{lastName}</p>
        </div>
        <div className="flex gap-4 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{bio}</h4> 
          <h4 className="text-base-semibold text-light-1">{personType}</h4> 
        </div>
      </div> 
      <Link href={{ pathname: '/Admin/UserInfo', query: { id } }}>
      <Button className="community-card_btn">
            Профиль 
      </Button>
      </Link>

    </article>
  );
};

export default UserCard;
