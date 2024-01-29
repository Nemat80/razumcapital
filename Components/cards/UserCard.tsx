"use client"

import Image from "next/image";
import { Button } from "../ui/button";

import Link from "next/link";


interface Props {
  id: string;
  name: string;
  lastName: string;
  imgUrl: string;
  bio:string;
}


const UserCard = ({
  id,
  imgUrl,
  name,
  lastName,
  bio
}: Props) => {

const stringId = id.toString();

  return (
    <article className="user-card border-2 rounded-xl border-stone-300 p-4 responsive_text text-light-1 font-bold" key={stringId}>
      <div className="user-card_avatar">
        <Image
          src={imgUrl}
          alt="logo"
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex gap-4 text-ellipsis">
        <p className="">{lastName}</p>
          <h4 className="">{name}</h4>
        </div>
        <div className="flex gap-4 text-ellipsis">
          <h4 className="">{bio}</h4> 
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
