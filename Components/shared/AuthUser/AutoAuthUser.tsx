"use client";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { fetchUser } from "@/lib/actions/user.actions";
import { useSignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import CreateAccountProfile from "./CreateAccountProfile";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface UserParams {
  _id: string;
  userId: string;
  lastname: string;
  name: string;
  bio: string;
  image: string;
  path: string;
  role: string;
  mail: string;
  tel: string;
  city: string;
  passport_series: string;
  passport_number: string;
  cardNumber: string;
}

export default function AutoAuthUser() {
  const router = useRouter();
  const pathname = usePathname();

  const [isCompliting, setIsCompliting] = useState(false);
  const [isCreate, setIsCreate] = useState(false);

  const { isLoaded, signUp } = useSignUp();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [createdUserId, setCreatedUserId] = useState("");
  const [userInfo, setUserInfo] = useState<UserParams>();
  const [id, setId] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await fetchUser(createdUserId);
        setUserInfo(userInfo);
      } catch (error) {
        console.error("Ошибка при получении информации о пользователе", error);
      }
    };

    fetchUserInfo();
  }, [createdUserId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (!isLoaded) {
        return;
      }

      const signUpResponse = await signUp.create({
        phoneNumber,
        password,
      });

      const signUpId = signUpResponse.createdUserId;
      if (!signUpId) return "";

      setCreatedUserId(signUpId);
      setIsCreate(true);
    } catch (error: any) {
      setError(`Ошибка при создании пользователя ${error.message}`);
    }
  };



  const findUserId = async () => {
    const userInfo = await fetchUser(createdUserId);
    setId(userInfo._id);
  };

  const handleComplete = () => {
    setIsCompliting(true);
    findUserId()
  };

  const userData = {
    id: createdUserId,
    objectId: userInfo?._id,
    lastname: userInfo?.lastname || "",
    name: userInfo?.name || "",
    bio: userInfo?.bio || "",
    image:
      userInfo?.image ||
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVGpVUTdCMW5JWkV3OFFhQTRZdGMzYlU0SWgiLCJyaWQiOiJ1c2VyXzJWa2JoVVdtZkg4djRWUHE3Y3BsWGZFZmEzbSJ9",
    role: userInfo?.role || "USER",
    mail: userInfo?.mail,
    tel: phoneNumber,
    city: userInfo?.city,
    passport_series: userInfo?.passport_series,
    passport_number: userInfo?.passport_number,
    cardNumber: userInfo?.cardNumber,
  };

  return (
    <>
      {isCompliting ? (
        <div className="flex flex-col gap-5 justify-center">
          <Button className="bg-primary-500" onClick={router.back}>
            назад
          </Button>
          <Link href={{ pathname: "/Admin/UserInfo", query: { id } }}>
            <Button className="bg-green-500 w-full">Добавить инвестицию</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-dark-2 p-10 rounded-md ">
          <div className="flex justify-center  gap-2">
            <div className="flex flex-col gap-2 w-6/12">
              <label className="text-base-semibold text-light-2">Логин</label>
              <Input
                className="account-form_input no-focus"
                type="tel"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 w-6/12">
              <label className="text-base-semibold text-light-2">Пароль</label>
              <Input
                className="account-form_input no-focus"
                type="text"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="text-light-1">
            {isCreate ? (
              <div className="mt-4">
                <CreateAccountProfile
                  user={userData}
                  onComplete={handleComplete}
                />
              </div>
            ) : (
              <>
                <p className="text-red-500 mt-1 items-center mt-4">
                  <Button
                    className="w-full bg-purple-500"
                    onClick={handleSubmit}
                  >
                    продолжить
                  </Button>
                  {error}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
