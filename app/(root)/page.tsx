import HomeTables from "@/Components/cards/HomeTables";
import { Button } from "@/Components/ui/button";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="flex justify-between gap-4 border-b-2 border-stone-300  mb-5 pb-3 w-full">
          <h2 className="head-text">Панель инвестиций</h2>
          <div className="">
            {userInfo?.role === "ADMIN" ? (
              <Link href={"/Admin"} className="text-green-300">
                <Button className="bg-red-500">Панель Админа</Button>
              </Link>
            ) : null}
          </div>
        </div>

        <HomeTables objectId={userInfo?._id} />
      </div>
    </>
  );
}
