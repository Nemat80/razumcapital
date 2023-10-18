


import ProfileHead from "@/Components/shared/ProfileHead";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");




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
