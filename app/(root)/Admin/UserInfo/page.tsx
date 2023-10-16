"use client";

import { useSearchParams } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";

import { InvestmentValidation } from "@/lib/validations/investment";
import { createInvestment } from "@/lib/actions/investment.actions";
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  fetchUserInfo,
  findInvestmentsByUserId,
} from "@/lib/actions/user.actions";
import { Document, Types } from "mongoose";
import TableInvestments from "@/Components/ui/Table";
import ProfileHeader from "@/Components/shared/ProfileHeader";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { userTabs } from "@/constants";
import Image from "next/image";
import UserProfile from "@/Components/shared/UserProfile";
import AccountProfile from "@/Components/forms/AccoutnProfile";

interface investments extends Document {
  id: string;
  amount: number;
  investor: Types.ObjectId;
  date: string;
  _id: string;
  contract: string;
  perMonth: string;
}

export default function UserInfo() {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = searchParams.get("id");
  if (!user) return null;

  const objectId = String(user);

  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      try {
        const fetchedUser = await fetchUserInfo(objectId);
        setUserInfo(fetchedUser);
      } catch (error) {
        console.error(error);
      }
    }

    getUser();
  }, []);

  const [edit, setEdit] = useState(false)

  const handleClickEdit = () => {
    setEdit(!edit); 
  };

  const userDataEdit = {
    id: userInfo?.id,
    objectId: userInfo?._id,
    lastname: userInfo?.lastname,
    name: userInfo?.name,
    bio: userInfo?.bio || "",
    image: userInfo?.image,
    role: userInfo?.role || "USER",
    mail: userInfo?.mail,
    tel: userInfo?.tel,
    city: userInfo?.city,
    passport_series: userInfo?.passport_series,
    passport_number: userInfo?.passport_number,
    cardNumber: userInfo?.cardNumber,
  };

  const form = useForm({
    resolver: zodResolver(InvestmentValidation),
    defaultValues: {
      amount: 0,
      investor: objectId,
      date: "",
      contract: "",
      perMonth: "",
    },
  });

  const [file, setFile] = useState<File[]>([]);
  const { startUpload } = useUploadThing("file");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (values: z.infer<typeof InvestmentValidation>) => {
    setIsSubmitting(true);

    const fileUrl = await startUpload(file);

    if (fileUrl && fileUrl[0].fileUrl) {
      values.contract = fileUrl[0].fileUrl;
    }

    await createInvestment({
      amount: values.amount,
      investor: user,
      date: values.date,
      path: pathname,
      contract: values.contract,
      perMonth: values.perMonth,
    });

    form.reset({
      amount: 0,
      investor: objectId,
      date: "",
      contract: "",
      perMonth: "",
    });

    window.location.reload();
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(Array.from(e.target.files));

      fileReader.onload = async (event) => {
        const FileDataUrl = event.target?.result?.toString() || "";
        fieldChange(FileDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const [investments, setInvestments] = useState<investments[]>([]);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const userInvestments = await findInvestmentsByUserId(user);
        setInvestments(userInvestments);
      } catch (error) {
        console.error("Failed to fetch user investments:", error);
      }
    };

    fetchInvestments();
  }, []);

  return (
    <>
      <div className="flex flex-col  justify-center items-center">
        <div className="flex items-center gap-4 border-b-2 border-stone-500  mb-5 pb-3 w-full">
          <Button className="bg-primary-500" onClick={router.back}>
            Назад
          </Button>
          <h1 className="head-text">Профиль</h1>
          <ProfileHeader objectId={objectId} />
        </div>
        <div className="mt-9 w-full">
          <Tabs defaultValue="investments" className="w-full">
            <TabsList className="tab">
              {userTabs.map((tab) => (
                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <p className="max-sm:hidden">{tab.label}</p>

                  {tab.label === "Инвестиции" && (
                    <p className="ml-1 rounded-sm bg-light-3 px-2 py-1 !text-tiny-medium text-light-2">
                      {investments.length}
                    </p>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="investments" className="w-full text-light-1">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col mx-auto w-3/6 justify-start gap-10 border border-dark-4 p-4"
                >
                  <legend className="text-center text-light-2">
                    Добавить инвестицию
                  </legend>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full gap-3">
                        <FormLabel className="text-base-semibold text-light-2">
                          Инвстиция
                        </FormLabel>
                        <FormControl className="no-focus border border-dark-4">
                          <Input
                            type="number"
                            className="account-form_input no-focus"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full gap-3">
                        <FormLabel className="text-base-semibold text-light-2">
                          Дата
                        </FormLabel>
                        <FormControl className="no-focus border border-dark-4">
                          <Input
                            type="date"
                            className="account-form_input no-focus"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contract"
                    render={({ field }) => (
                      <FormItem className="flex flex-col  gap-3">
                        <FormLabel className="text-base-semibold w-full text-light-2">
                          Договор
                        </FormLabel>
                        <FormControl className="no-focus border border-dark-4">
                          <Input
                            type="file"
                            placeholder="Зашрузите договор"
                            className="w-50 border border-dark-4 bg-dark-3 no-focus text-light-2 file:text-blue"
                            required
                            onChange={(e) =>
                              handleFileChange(e, field.onChange)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full justify-center gap-3">
                    <FormField
                      control={form.control}
                      name="perMonth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col border-r-2 border-stone-400 pr-4">
                          <FormLabel className="text-start text-[14px] text-light-2">
                            Без реинвестирования
                          </FormLabel>
                          <FormControl className="no-focus border border-dark-4">
                            <Input
                              name="permonth"
                              type="radio"
                              value="PER_MONTH"
                              className="w-5  self-center"
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="perMonth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pl-4">
                          <FormLabel className="text-end text-[14px] text-light-2 ">
                            С реинвестированием
                          </FormLabel>
                          <FormControl className="no-focus border border-dark-4">
                            <Input
                              name="permonth"
                              type="radio"
                              value="PER_SIX_MONTH"
                              className="w-5 h-10 self-center "
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isSubmitting ? (
                    <Button className="bg-green-500">
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
                    <Button type="submit" className="bg-green-500">
                      Добавить
                    </Button>
                  )}
                </form>
              </Form>

              {investments.length === 0 ? (
                <p className="no-result">Инвестиций не найдено</p>
              ) : (
                <div className="w-full">
                  <TableInvestments investments={investments} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="user" className="w-full text-light-1">
              {userInfo ? (
                <div className="flex flex-col gap-5 mt-9 bg-dark-2 p-10">
                <UserProfile
                  imgUrl={userInfo.image}
                  lastname={userInfo.lastname}
                  name={userInfo.name}
                  bio={userInfo.bio}
                  mail={userInfo.mail}
                  tel={userInfo.tel}
                  city={userInfo.city}
                  series={userInfo.passport_series}
                  number={userInfo.passport_number}
                  cardNumber={userInfo.cardNumber} 
                />
                <Button 
                className="bg-blue"
                onClick={handleClickEdit}
                >
                  Изменить профиль
                </Button>
                {edit ? (
                  <AccountProfile  user={userDataEdit} />
                ) : (null)}
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
