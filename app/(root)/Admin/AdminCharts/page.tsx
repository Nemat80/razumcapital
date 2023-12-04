import TotalAmountCard from "@/Components/cards/totalAmountCard";
import AdminPieCharts from "@/Components/shared/AdminPieCharts";
import { Button } from "@/Components/ui/button";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminCharts() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (userInfo.role === "USER") redirect("/");

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center">
        <Link href="/Admin">
          <Button className="bg-primary-500">Назад</Button>
        </Link>

        <p className="head-text">Статистика инвестиций и инвесторов</p>
      </div>
      <AdminPieCharts />
      <TotalAmountCard />
    </div>
  );
}
