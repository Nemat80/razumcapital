import Image from "next/image";
import CreditCard from "./Card";

interface Props {
  name: string;
  imgUrl: string;
  lastname: string;
  bio: string;
  mail: string;
  tel: string;
  city: string;
  series: string;
  number: string;
  cardNumber: string;
}

function ProfileHead({
  name,
  imgUrl,
  lastname,
  bio,
  mail,
  tel,
  city,
  series,
  number,
  cardNumber,
}: Props) {
  return (
    <>
      <div className="border-b-2 border-stone-300  pb-3 flex gap-5 items-center">
        <div className="flex flex-wrap gap-4">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="Profile Image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>  
          <div className="text-heading4-medium flex flex-col flex-wrap gap-2">
            <p className="text-light-1"> {lastname}</p>
            <p className="text-light-1">{name}</p>
            <p className="text-light-1">{bio}</p>
          </div>
        </div>
        <CreditCard
          mail={mail}
          tel={tel}
          city={city}
          series={series}
          number={number}
          cardNumber={cardNumber}
        />
      </div>
    </>
  );
}

export default ProfileHead;
