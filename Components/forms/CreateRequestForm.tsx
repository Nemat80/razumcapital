import { createRequest } from "@/lib/actions/request.action";
import { RequestValidation } from "@/lib/validations/request";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

interface Props {
  investment: string;
  id: number;
  date: string;
}

export default function CreateRequestForm({ investment, id, date }: Props) {
  const form = useForm({
    resolver: zodResolver(RequestValidation),
    defaultValues: {
      investmentId: investment,
      index: id,
      method: "",
      initials: "",
      amount: 0,
      date: date,
      status: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RequestValidation>) => {
    await createRequest({
      investmentId: investment,
      index: id,
      method: values.method,
      initials: values.initials,
      amount: values.amount,
      date: date,
      status: values.status,
    });
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col rounded-md justify-start gap-10 mx-4"  
        >
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Метод
                </FormLabel>
                <FormControl>
                  <Input
                    type="method"
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
            name="initials"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Инициалы
                </FormLabel>
                <FormControl>
                  <Input
                    type="initials"
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
            name="amount"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Сумма
                </FormLabel>
                <FormControl>
                  <Input
                    type="amount"
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
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Статус
                </FormLabel>
                <FormControl>
                  <Input
                    type="status"
                    className="account-form_input no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-500">
            Добавить
          </Button>
        </form>
      </Form>
    </div>
  );
}
