"use client";

import { fetchUsers } from "@/lib/actions/user.actions";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import UserCard from "../cards/UserCard";
import Searchbar from "./SearchBar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Pagination from "./Pagination";

interface Props {
  userId: string;
  searchParams: { [key: string]: string | undefined };
}

export default function SearchUsers({ userId, searchParams }: Props) {
  const [result, setResult] = useState<{ users: any[]; isNext: boolean;  }>(() => {

    const cachedResult = sessionStorage.getItem('searchResults')
    try {
      return cachedResult !== null ? JSON.parse(cachedResult) : { users: [], isNext: false }
    } catch (error) {
      console.error("Ошибка разбора JSON:", error)
      return { users: [], isNext: false }
    }
  })



  const [city, setCity] = useState("");

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value); 
  }, []);

  useEffect(() => {
    async function getUsers() {
      try {
        const result = await fetchUsers({
          userId: userId,
          searchString: searchParams.q || "",
          pageSize: 20, 
          pageNumber: searchParams?.page ? +searchParams.page : 1,
          city: city,
        })
        .then((json) => setResult(json))

        
        sessionStorage.setItem('searchResults', JSON.stringify(result));
      } catch (error) {
        console.error(error);
      }
    }

    getUsers();
  }, [searchParams, city, userId]);

  useEffect(() => {
    setResult(prevResult => ({ ...prevResult, isNext: true }));
  }, [searchParams, city]);

  return (
    <div className="flex flex-col w-full gap-2">
      <Searchbar routeType="Admin" />
      <div className="w-full flex gap-2 pt-1">
        <Button className="bg-black" onClick={() => setCity("")}>
          Все
        </Button>
        <Button className="bg-black" onClick={() => setCity("Toshkent")}>
          Ташкент
        </Button>
        <Button className="bg-black" onClick={() => setCity("Buxoro")}>
          Бухара
        </Button>
        <div className="">
          <Input
            type="text"
            className="text-light-1 bg-black"
            placeholder="Другие города..."
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-4">
        {result === undefined ? (
          <div>Loading...</div>
        ) : result.users.length === 0 ? (
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
              />
            ))}
          </>
        )}
      </div>
      <Pagination
        path="Admin"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result?.isNext ?? false} 
      />
    </div>
  );
}
