"use client";

import { useEffect, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { usePathname, useRouter } from "next/navigation";
import { fetchUser, updateUser } from "@/lib/actions/user.actions";
import Link from "next/link";

export default  function SignUpForm() {


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompliting, setIsCompliting] = useState(false);




  const [createdUserId, setCreatedUserId] = useState("");
  const [id, setId] = useState("");


  useEffect(() => {

    const fetchUserInfo = async () => {
      try {
        const userInfo = await fetchUser(createdUserId);
        setId(userInfo._id); // Устанавливаем результат в setId
      } catch (error) {
        console.error('Ошибка при получении информации о пользователе', error);
      }
    };

    fetchUserInfo();  
  }, [createdUserId]);




  const { isLoaded, signUp } = useSignUp();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [lastname, setLastname] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [mail, setMail] = useState("");
  const [city, setCity] = useState("");
  const [passport_series, setPassport_series] = useState("");
  const [passport_number, setPassport_number] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // start the sign up process.
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (!isLoaded) {
      return;
    }

    try {
      const signUpResponse = await signUp.create({
        phoneNumber,
        password,
      });

      const signUpId = signUpResponse.createdUserId;
      if (!signUpId) return "";


      setCreatedUserId(signUpId)

      await updateUser({
        userId: signUpId,
        lastname: lastname,
        name: name,
        bio: bio,
        image:
          "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVGpVUTdCMW5JWkV3OFFhQTRZdGMzYlU0SWgiLCJyaWQiOiJ1c2VyXzJWa2JoVVdtZkg4djRWUHE3Y3BsWGZFZmEzbSJ9",
        path: pathname,
        role: "USER",
        mail: mail,
        tel: phoneNumber,
        city: city,
        passport_series: passport_series,
        passport_number: passport_number,
        cardNumber: cardNumber,
      });

      setPendingVerification(true);



      setIsCompliting(true)
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };


  return (
    <>
    {isCompliting ? (
      <div className="flex flex-col gap-5 justify-center">
          <Button className="bg-primary-500" onClick={router.back}>
          назад
        </Button>
        <Link  href={{ pathname: '/Admin/UserInfo', query: { id } }}>
        <Button className="bg-green-500 w-full"  >
          Добавить инвестицию
        </Button>
      </Link>
      </div>
    ): (
    <>
    <div>
      {!pendingVerification && (
        <form className="flex flex-col  gap-5">
          <div className="flex  gap-2 w-full">
            <div className="w-1/2 flex flex-col gap-3">
              <Label
                className="text-base-semibold text-light-2"
                htmlFor="phone"
              >
                Номер телефона
              </Label>
              <Input
                onChange={(e) => setPhoneNumber(e.target.value)}
                id="tel"
                name="tel"
                type="tel"
                required
                placeholder="+998"
                className="account-form_input no-focus"
              />
            </div>
            <div className="w-1/2 flex flex-col gap-3">
              <Label
                className="text-base-semibold text-light-2"
                htmlFor="password"
              >
                Пароль
              </Label>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                className="account-form_input no-focus"
                id="password"
                name="password"
                type="text"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-light-2" htmlFor="lastnmae">
              Фамилия
            </Label>
            <Input
              className="account-form_input no-focus "
              onChange={(e) => setLastname(e.target.value)}
              id="lastName"
              name="lastName"
              type="text"
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-light-2" htmlFor="name">
              Имя
            </Label>
            <Input
              onChange={(e) => setName(e.target.value)}
              className="account-form_input no-focus "
              id="name"
              name="name"
              type="text"
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-light-2" htmlFor="bio">
              Отчество
            </Label>
            <Input
              className="account-form_input no-focus "
              onChange={(e) => setBio(e.target.value)}
              id="bio"
              name="bio"
              type="text"
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-light-2" htmlFor="mail">
              Email
            </Label>
            <Input
              onChange={(e) => setMail(e.target.value)}
              className="account-form_input no-focus "
              id="email"
              name="email"
              type="email"
              placeholder="some@mail.com"
              required
            />
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-3 w-1/2">
              <Label className="text-light-2 " htmlFor="passport_series">
                Серия паспорта
              </Label>
              <Input
                className="account-form_input no-focus"
                onChange={(e) => setPassport_series(e.target.value)}
                id="passport_series"
                name="passport_series"
                type="text"
                required
                placeholder="AA"
              />
            </div>
            <div className="w-1/2 flex flex-col gap-3">
              <Label className="text-light-2" htmlFor="passport_number">
                Номер паспорта
              </Label>
              <Input
                className="account-form_input no-focus"
                onChange={(e) => setPassport_number(e.target.value)}
                id="passport_number"
                name="passport_number"
                type="text"
                placeholder="1234567"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-light-2" htmlFor="cardNumber">
              Номер карты
            </Label>
            <Input
              className="account-form_input no-focus "
              onChange={(e) => setCardNumber(e.target.value)}
              id="cardNumber"
              name="cardNumber"
              type="text"
              required
              placeholder="1...16"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-light-2" htmlFor="city">
              Город
            </Label>
            <Input
              className="account-form_input no-focus "
              onChange={(e) => setCity(e.target.value)}
              id="city"
              name="city"
              type="text"
              placeholder="Ташкент"
              required
            />
          </div>

          {isSubmitting ? (
            <Button className="bg-green-500 pt-2">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </Button>
          ) : (
            <Button type="submit" onClick={handleSubmit} className="bg-green-500 pt-2">
              Добавить
            </Button>
          )}
        </form>
      )}
      
    </div>
    </>)}
    </>
  )
}
