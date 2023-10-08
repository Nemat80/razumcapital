import SignUpForm from '@/Components/shared/CreateUserForm'
import React from 'react'

export default function page() {
  return (
    <section className="mt-9 bg-dark-2 p-10 rounded-md">
      <p className='head-text text-center pb-8'>Авторизация пользователя</p>
      <SignUpForm  />
    </section>
  )
}
