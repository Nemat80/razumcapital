import UserInfoComponent from '@/Components/shared/UserInfo';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Page() {
    const user = await currentUser();
    if (!user) return null;
  
    const userInfo = await fetchUser(user.id);
  
    if (userInfo.role === "USER") {
      redirect("/")
    }
  

  return (
    <>
    <UserInfoComponent />
    </>
  )
}
