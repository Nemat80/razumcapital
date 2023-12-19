import UserPieStatCount from "./UserPieStatCount";
import UserBalanceStat from "./userBalanceStat";

interface Props {
    objectId:string;
}

export default async function UserPieCharts({objectId}:Props) {


  return (
    <div className="flex flex-col gap-2">
      <UserPieStatCount objectId={objectId} />
      <UserBalanceStat objectId={objectId} />
    </div>
  );
}
