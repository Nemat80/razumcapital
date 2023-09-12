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
import { useEffect, useState, ChangeEvent } from "react";
import { findInvestmentsByUserId } from "@/lib/actions/user.actions";
import { Document, Types } from "mongoose";
import TableInvestments from "@/Components/ui/Table";
import ProfileHeader from "@/Components/shared/ProfileHeader";
import { useRouter } from "next/navigation";
import { useUploadThing, uploadFiles } from "@/lib/uploadthing";
import { isBase64Pdf } from "@/lib/utils";

interface investments extends Document {
  id: string;
  amount: number;
  investor: Types.ObjectId;
  date: string;
  _id: string;
  contract: string;
}

export default function UserInfo() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = searchParams.get("id");
  if (!user) return null;
  const objectId = String(user);

  const form = useForm({
    resolver: zodResolver(InvestmentValidation),
    defaultValues: {
      amount: 0,
      investor: objectId,
      date: "",
      contract: "",
    },
  });

  const [file, setFile] = useState<File[]>([]);
  const { startUpload } = useUploadThing("file");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof InvestmentValidation>) => {
    setIsSubmitting(true);

    const blob = values.contract;

    const hasPdfChanged = isBase64Pdf(blob);

    if (hasPdfChanged) {
      const pdfRes = await startUpload(file);

      if (pdfRes && pdfRes[0].fileUrl) {
        values.contract = pdfRes[0].fileUrl;
      }
    }

    await createInvestment({
      amount: values.amount,
      investor: user,
      date: values.date,
      path: pathname,
      contract: values.contract,
    });

    form.reset({
      amount: 0,
      investor: objectId,
      date: "",
      contract: "",
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

      if (!file.type.includes("pdf")) return;

      fileReader.onload = async (event) => {
        const PdfDataUrl = event.target?.result?.toString() || "";
        fieldChange(PdfDataUrl);
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-3/6 justify-start gap-10 border border-dark-4 p-4"
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
                <FormItem className="flex flex-col w-full gap-3">
                  <FormLabel className="text-base-semibold text-light-2">
                    Договор
                  </FormLabel>
                  <FormControl className="no-focus border border-dark-4">
                    <Input
                      type="file"
                      placeholder="Зашрузите договор"
                      className="border border-dark-4 bg-dark-3 no-focus text-light-2 file:text-blue"
                      required
                      onChange={(e) => handleFileChange(e, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
      </div>
    </>
  );
}
