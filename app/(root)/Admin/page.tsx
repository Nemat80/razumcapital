import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { Button } from "@/Components/ui/button";
import Link from "next/link";
import Searchbar from "@/Components/shared/SearchBar";
import UserCard from "@/Components/cards/UserCard";
import Pagination from "@/Components/shared/Pagination";

export default async function Admin({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams?.q || '', // Правильно передаем значение "q" из объекта searchParams или пустую строку, если ключ "q" не существует
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

      <Searchbar routeType='Admin' />

      <div className='mt-14 flex flex-col gap-9'>
      {result.users.length === 0 ? (
        <p className="no-result">Не найдено инвесторов</p>
      ) : (
        <>
          {result.users.map((person) => (
            <UserCard
              key={person.id}
              id={person._id}
              name={person.name}
              lastName={person.lastname}
              imgUrl={person.image}
              bio={person.bio}
              personType={person.role}
            />
          ))}
          </>
        )}
      </div>

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
