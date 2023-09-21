import AccountProfile from "@/Components/forms/AccoutnProfile";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

async function Page() { 
  const user = await currentUser();
  if (!user) return null;  

  const userInfo = await fetchUser(user.id);
  if (userInfo?.onboarded) redirect("/");


  const userData = {
    id: user.id, 
    objectId: userInfo?._id,
    lastname: userInfo?.lastname || user?.lastName,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user.imageUrl,
    role: userInfo?.role,
  };
  

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        complete your profile now to use Razum Capital
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile
         user={userData} 
        />
      </section>
    </main>
  );
}

export default Page;
