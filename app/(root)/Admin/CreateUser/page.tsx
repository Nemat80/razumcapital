"use client"

import SignUpForm from '@/Components/shared/CreateUserForm'
import { Button } from '@/Components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function page() {

  const router = useRouter()

  return (
    <section className="mt-9 bg-dark-2 p-10 rounded-md">
      <div className='flex gap-10'>
      <Button className="bg-primary-500" onClick={router.back}>
          Назад
        </Button>
        <p className='head-text text-center pb-8'>Авторизация пользователя</p>
      </div>
      <SignUpForm  />
    </section>
  )
}
