"use client";

import { fetchUsers } from "@/lib/actions/user.actions";
import React, { useEffect, useState } from "react";
import UserCard from "../cards/UserCard";
import Searchbar from "./SearchBar";
import { Button } from "../ui/button";

interface Props {
  userId: string;
  searchParams: { [key: string]: string | undefined };
}

export default function SearchUsers({ userId, searchParams }: Props) {
  const [result, setResult] = useState<{ users: any[]; isNext: boolean }>();
  const [city, setCity] = useState("");

  useEffect(() => {
    async function getUsers() {
      try {
        const result = await fetchUsers({
          userId: userId,
          searchString: searchParams?.q || "",
          pageNumber: searchParams?.page ? +searchParams.page : 1,
          pageSize: 20,
          city: city,
        });
        setResult(result);
      } catch (error) {
        console.error(error);
      }
    }

    getUsers();
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
      </div>
      <div className="mt-14 flex flex-col gap-9">
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
                personType={person.role}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
