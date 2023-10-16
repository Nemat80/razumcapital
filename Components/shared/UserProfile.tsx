import Image from "next/image";
import Card from "./Card";

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

export default function UserProfile({
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
      <div className="flex gap-8 items-center p-5  justify-start  border-2 border-stone-400">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="Profile Image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-col text-heading4-medium gap-3">
            <p className="text-light-1"> {lastname}</p>
            <p className="text-light-1">{name}</p>
            <p className="text-light-1">{bio}</p>
          </div>
        <Card
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
