import React, { ChangeEvent, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InvestmentValidation } from "@/lib/validations/investment";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateInvestment } from "@/lib/actions/investment.actions";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";


interface Props {
    objectId:string;
    userId: string;
    amount:number;
    date:string;
    contract:string;
    perMonth:string;
}




export default function UpdateInvestmentForm( { objectId, userId, amount, date, contract,perMonth }:Props) {

  const pathname = usePathname()
    
  const form = useForm({
    resolver: zodResolver(InvestmentValidation),
    defaultValues: {
      amount: amount,
      investor: userId,
      date: date,
      pathname: pathname,
      contract: contract,
      perMonth: perMonth,
    },
  });

  const [file, setFile] = useState<File[]>([]);
  const { startUpload } = useUploadThing({ endpoint: "file" });

  const [isSubmitting, setIsSubmitting] = useState(false)

  
  const onSubmit = async (values: z.infer<typeof InvestmentValidation>) => {
    setIsSubmitting(true);

    const fileUrl = await startUpload(file);

    if (fileUrl && fileUrl[0]?.fileUrl ) {
      values.contract = fileUrl[0].fileUrl;
    } else {
        values.contract = ""
    }


    await UpdateInvestment({
      objectId: objectId,
      amount: values.amount,
      investor: userId,
      date: values.date,
      path: pathname,
      contract: values.contract,
      perMonth: values.perMonth,
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

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col  w-full mt-4  justify-start gap-10 border border-dark-4 rounded-md p-6"
        >
          <legend className="text-center text-light-2">
            Изменить инвестицию
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
                    onChange={(e) => handleFileChange(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-center gap-3 hidden">
            <FormField
              control={form.control}
              name="perMonth"
              render={({ field }) => (
                <FormItem className="flex flex-col border-r-2 border-stone-400 pr-4">
                  <FormLabel className="text-start  text-subtle-semibold">
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
                  <FormLabel className="text-end text-subtle-semibold">
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
              Изменить
            </Button>
          )}
        </form>
      </Form>
    </>
  );
}
