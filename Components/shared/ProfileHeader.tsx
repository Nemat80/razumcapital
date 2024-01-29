import { fetchUserInfo } from "@/lib/actions/user.actions"
import { useEffect, useState } from "react";

interface Props {
    objectId:string
}
interface Info {
    name:string;
    bio:string;
    lastname:string;
}




export default  function ProfileHeader({objectId}:Props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
      async function getUser() {
        try {
          const fetchedUser = await fetchUserInfo(objectId);
          setUser(fetchedUser);
        } catch (error) {
          console.error(error);
        }
      }
  
      getUser();
    }, [objectId]);
  
    if (!user) {
      return <div>Loading...</div>;
    }
  
    const { name, lastname, bio }:Info = user;
  
    return (
      <div className="flex items-center gap-4 border-l px-2 text-light-2">
        <p>{lastname}</p>
        <p>{name}</p>
        <p>{bio}</p>
      </div>
    );
  }
  