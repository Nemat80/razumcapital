import HomeTables from "@/Components/cards/HomeTables";
import { Button } from "@/Components/ui/button";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";






export default async function Home() {

  const user = await currentUser();
  if (!user) return redirect("/");

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");






  
  return (
    <>
    <div className="w-full flex flex-col" >
      <div className="flex justify-between">
        <h2 className="head-text">Панель инвестиций</h2>
        <div className="">
        {userInfo?.role === "ADMIN" ? (
          <Button className="bg-red-500">
            <Link href={"/Admin"} className="text-green-300" >
              Панель Админа
            </Link>
          </Button>
        ): null}
        </div>
      </div>


          <HomeTables objectId={userInfo?._id} />

    </div>
    </>
  )
}