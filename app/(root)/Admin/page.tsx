
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/Components/cards/UserCard";


export default async function Admin() {

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
  });

  if (userInfo?.role === "ADMIN") {
    return (
      <>
        <div className="flex w-full">
          <h1 className="head-text border-b-2 border-stone-500 mb-5 pb-3 w-full">Панель Админа</h1>
        </div>

        <div className="">

        <div className="mt-10 flex  flex-col gap-2">
          {result.users.length === 0 ? (
            <p className="no-result">Не найдено инвесторов</p>
          ) : (
            <>
              {result.users.map((person) => (
                <UserCard
                  key={person.id.toString()}
                  id={person._id.toString()}
                  name={person.name}
                  lastName={person.lastname}
                  imgUrl={person.image}
                  bio={person.bio}
                  personType="Investor"
                />
              ))}
            </>
          )}
        </div>

                
        </div>
      </>
    )
  } else {
    redirect("/");
  }
}
