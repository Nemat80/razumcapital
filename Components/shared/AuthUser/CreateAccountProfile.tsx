"use client";

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
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

interface Props {
  onComplete: () => void;

  user: {
    id: string;
    objectId: string | undefined; // сделали свойство допускающим неопределенные значения
    lastname: string;
    name: string;
    bio: string;
    image: string;
    role: string;
    mail: string | undefined; // сделали свойство допускающим неопределенные значения
    tel: string | undefined; // сделали свойство допускающим неопределенные значения
    city: string | undefined; // сделали свойство допускающим неопределенные значения
    passport_series: string | undefined; // сделали свойство допускающим неопределенные значения
    passport_number: string | undefined; // сделали свойство допускающим неопределенные значения
    cardNumber: string | undefined; // сделали свойство допускающим неопределенные значения
  };
}

const CreateAccountProfile = ({ user, onComplete }: Props) => {
  const { startUpload } = useUploadThing({ endpoint: "file" });
  const [files, setFiles] = useState<File[]>([]);

  const [show, setShow] = useState(true);

  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      lastname: user?.lastname || "",
      bio: user?.bio || "",
      mail: user?.mail || "",
      tel: user?.tel || "",
      city: user?.city || "",
      passport_series: user?.passport_series || "",
      passport_number: user?.passport_number || "",
      cardNumber: user?.cardNumber || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    setShow(false);

    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].fileUrl) {
        values.profile_photo = imgRes[0].fileUrl;
      }
    }

    await updateUser({
      userId: user.id,
      lastname: values.lastname,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
      role: user.role,
      mail: values.mail,
      tel: values.tel,
      city: values.city,
      passport_series: values.passport_series,
      passport_number: values.passport_number,
      cardNumber: values.cardNumber,
    });

    onComplete();
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col rounded-md justify-start gap-10"
        >
          <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                  {field.value ? (
                    <Image
                      src={field.value}
                      alt="profile photo"
                      width={96}
                      height={96}
                      priority
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <Image
                      src="/assets/profile.svg"
                      alt="profile photo"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Upload a photo"
                    className="account-form_image-input"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Отчество
                </FormLabel>
                <FormControl>
                  <Input className="account-form_input no-focus" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mail"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Почта (Email)
                </FormLabel>
                <FormControl>
                  <Input
                    className="account-form_input no-focus"
                    type="email"
                    placeholder="some@mail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Город проживания
                </FormLabel>
                <FormControl>
                  <Input
                    className="account-form_input no-focus"
                    type="text"
                    placeholder="Ташкент"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex">
            <FormField
              control={form.control}
              name="passport_series"
              render={({ field }) => (
                <FormItem className="flex flex-col w-50 gap-3">
                  <FormLabel className="text-base-semibold text-light-2">
                    Серия паспорта
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="account-form_input no-focus"
                      type="text"
                      placeholder="AA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passport_number"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-3">
                  <FormLabel className="text-base-semibold text-light-2">
                    Номер паспорта
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="account-form_input no-focus"
                      type="text"
                      placeholder="1234567"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                    type="text"
                    placeholder="1111 2222 3333 4444"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {show ? (
            <Button type="submit" className="bg-primary-500">
              Продолжить
            </Button>
          ) : null}
        </form>
      </Form>
    </div>
  );
};

export default CreateAccountProfile;
