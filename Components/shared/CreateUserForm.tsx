"use client";

import { useEffect, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { fetchUser, updateUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import { CreateUserValidation } from "@/lib/validations/createUser";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpForm() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompliting, setIsCompliting] = useState(false);

  const [createdUserId, setCreatedUserId] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await fetchUser(createdUserId);
        setId(userInfo._id);
      } catch (error) {
        console.error("Ошибка при получении информации о пользователе", error);
      }
    };

    fetchUserInfo();
  }, [createdUserId]);



  const { isLoaded, signUp } = useSignUp();

  const [pendingVerification, setPendingVerification] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CreateUserValidation), 
    defaultValues: {
      password: "",
      profile_photo: "",
      name: "",
      lastname: "",
      bio:  "",
      mail:  "",
      tel: "",
      city: "",
      passport_series: "",
      passport_number: "",
      cardNumber: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateUserValidation>) => {
    setIsSubmitting(true);

    if (!isLoaded) {
      return;
    }

    try {
      const signUpResponse = await signUp.create({
        phoneNumber: values.tel,
        password: values.password,
      });

      const signUpId = signUpResponse.createdUserId;
      if (!signUpId) return "";

      setCreatedUserId(signUpId);

      await updateUser({
        userId: signUpId,
        lastname: values.lastname,
        name: values.name,
        bio: values.bio,
        image:
          "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVGpVUTdCMW5JWkV3OFFhQTRZdGMzYlU0SWgiLCJyaWQiOiJ1c2VyXzJWa2JoVVdtZkg4djRWUHE3Y3BsWGZFZmEzbSJ9",
        path: pathname,
        role: "USER",
        mail: values.mail,
        tel: values.tel,
        city: values.city,
        passport_series: values.passport_series,
        passport_number: values.passport_number,
        cardNumber: values.cardNumber,
      });

      setPendingVerification(true);

      setIsCompliting(true);
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
          <Link href={{ pathname: "/Admin/UserInfo", query: { id } }}>
            <Button className="bg-green-500 w-full">Добавить инвестицию</Button>
          </Link>
        </div>
      ) : (
        <>
          <div>
            {!pendingVerification && (
              <>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col rounded-md justify-start gap-10"
                >
                  <div className="flex  gap-2 w-full">
                    <FormField
                      control={form.control}  
                      name="tel"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                          <FormLabel className="text-base-semibold text-light-2">
                            Номер телефона
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="account-form_input no-focus"
                              type="tel"
                              placeholder="+998"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-1/2 flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                          <FormLabel className="text-base-semibold text-light-2">
                            Пароль
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="account-form_input no-focus"
                              type="password"
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> 
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                          <FormLabel className="text-base-semibold text-light-2">
                            Фамилия
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="account-form_input no-focus"
                              type="lastname"
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                          <FormLabel className="text-base-semibold text-light-2">
                            Имя
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="account-form_input no-focus"
                              type="name"
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                          <FormLabel className="text-base-semibold text-light-2">
                            Отчество
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="account-form_input no-focus"
                              type="bio"
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="mail"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                          <FormLabel className="text-base-semibold text-light-2">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="account-form_input no-focus"
                              type="mail"
                              placeholder="some@mail.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex flex-col gap-3 w-1/2">
                      <FormField
                        control={form.control}
                        name="passport_series"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full gap-3">
                            <FormLabel className="text-base-semibold text-light-2">
                              Серия паспорта
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="account-form_input no-focus"
                                type="passport_series"
                                placeholder=""
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/2 flex flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="passport_number"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full gap-3">
                            <FormLabel className="text-base-semibold text-light-2">
                              Серия паспорта
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="account-form_input no-focus"
                                type="passport_number"
                                placeholder=""
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                          <FormLabel className="text-base-semibold text-light-2">
                            Номер карты
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="account-form_input no-focus"
                              type="cardNumber"
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                          <FormLabel className="text-base-semibold text-light-2">
                            Город
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="account-form_input no-focus"
                              type="city"
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
                    <Button  type="submit" className="bg-green-500 pt-2">
                      Добавить
                    </Button>
                  )}
                </form>
              </Form>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
