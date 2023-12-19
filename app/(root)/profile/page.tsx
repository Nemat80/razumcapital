import ProfileHead from "@/Components/shared/ProfileHead";
import UserPieCharts from "@/Components/shared/UserPieCharts";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <div className="text-light-1 flex flex-col gap-2">
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
      <div className="flex flex-col gap-2 w-full text-light-1">
        <h1 className="head-text">Инвестиции</h1>
        <UserPieCharts objectId={userInfo?._id}/>
      </div>
    </div>
  );
}

export default Page;
