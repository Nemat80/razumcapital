import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { Button } from "@/Components/ui/button";
import Link from "next/link";
import SearchUsers from "@/Components/shared/SearchUsers";




export default async function Admin({
  searchParams,
}: {
  searchParams: {[key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (userInfo.role === "USER") {
    redirect("/")
  }



  return (
    <>
      <div className="flex w-full justify-between border-b-2 border-stone-500 mb-5 pb-3 w-full">
        <h1 className="head-text ">Панель Админа</h1>т

        <div className="flex gap-2">
          <Link href={"/AdminCharts"}>
            <Button className="flex bg-dark-2  text-[14px] text-center p-2">
              Статистика
            </Button>
          </Link>
          <Link href={"/CreateUser"}>
            <Button className="flex bg-dark-2  text-[14px] text-center p-2">
              Создать профиль
            </Button>
          </Link>
        </div>
      </div>
      <section>
        <SearchUsers userId={user.id} searchParams={searchParams}  />
      </section>
    </>
  );
}