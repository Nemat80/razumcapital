"use client"

import { fetchUsersRequests } from '@/lib/actions/user.actions';
import React, { useEffect, useState } from 'react'
import InvestmentUserCard from '../cards/InvestmentUserCard';
import Searchbar from './SearchBar';


interface Props {
    userId: string;
    searchParams: { [key: string]: string | undefined };
  }


export default function SearchInvestments({ userId, searchParams }: Props) {
    const [result, setResult] = useState<{ users: any[]; isNext: boolean }>();

    useEffect(() => {
        async function getUsersRequests() {
          try {
            const result = await fetchUsersRequests({
              userId: userId,
              searchString: searchParams?.q || "",
              pageNumber: searchParams?.page ? +searchParams.page : 1,
              pageSize: 20,
            });
            setResult(result);
          } catch (error) {
            console.error(error);
          }
        }
    
        getUsersRequests();
      }, [searchParams]);


  return (
    <div className="mt-5 flex flex-col gap-9">
        <Searchbar routeType="Admin/Requests" />
        {result === undefined ? (
          <div>Loading...</div>
        ) : result.users.length === 0 ? (
          <p className="no-result">Не найдено инвесторов</p>
        ) : (
          <>
            {result.users.map((person) => (
              <InvestmentUserCard
                key={person.id}
                id={person._id}
                name={person.name}
                lastName={person.lastname}
                imgUrl={person.image}
                bio={person.bio}
              />
            ))}
          </>
        )}
      </div>
  )
}
