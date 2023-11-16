import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { Button } from "@/Components/ui/button";
import Link from "next/link";
import Pagination from "@/Components/shared/Pagination";
import SearchUsers from "@/Components/shared/SearchUsers";




export default async function Admin({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;


  const userInfo = await fetchUser(user.id);
  if (userInfo.role === "USER") redirect("/");

  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams?.q || '', 
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 20,
  });


  if (userInfo?.role === "ADMIN") {
    return (
      <>
        <div className="flex w-full justify-between border-b-2 border-stone-500 mb-5 pb-3 w-full">
          <h1 className="head-text ">Панель Админа</h1>

          <Link href={"/Admin/CreateUser"}>
            <Button className="flex bg-green-400 text-[14px] text-center p-2">
              Создать профиль
            </Button>
          </Link>
        </div>
        <section>

      <SearchUsers 
      userId={user.id}
      searchParams={searchParams}
      />

      <Pagination
        path='Admin'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </section>
        <div>
        </div>
      </>
    );
  } else {
    redirect("/");
  }
}
