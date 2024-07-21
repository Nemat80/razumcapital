import { UpdateRequests } from "@/lib/actions/request.action";
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
import { useState } from "react";
import Modal from "../Modal/Modal";
import { UpdateRequestValidation } from "@/lib/validations/update.requests";

interface Props {
  _id: string;
  amount:number;
  initials: string;
  method: string;
  status:string;
  investment: string;
  index: number;
  date: Date;
}

export default function UpdateRequestForm({
  _id,
  investment,
  amount,
  initials,
  index,
  date,
}: Props) {
  const [showModal, setShowModal] = useState(false);


  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const form = useForm({
    resolver: zodResolver(UpdateRequestValidation),
    defaultValues: {
      objectId:_id,
      investmentId: investment,
      index: index,
      method: "card",
      initials: initials ||  "empty",
      amount: amount || 0,
      date: date,
      status: "approved",
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdateRequestValidation>) => {

    await UpdateRequests({
      objectId:_id,
      investmentId: investment,
      index: index,
      method: values.method,
      initials: values.initials,
      amount: values.amount,
      date: date,
      status: values.status,
    });
    window.location.reload();
  }




  return (
    <div>
      <img
        className="hover:scale-110 "
        src="/assets/edit.svg"
        width={30}
        height={30}
        alt="edit icon"
        onClick={openModal}
      />
      {showModal && (
        <Modal onClose={closeModal}>
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
                      <select
                        className="account-form_input no-focus p-3"
                        {...field}
                      >
                        <option value="card">На карту</option>
                        <option value="cash">Наличные</option>
                        <option value="crypto">Криптокошелек</option>
                      </select>
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
                      <select
                        className="account-form_input no-focus p-3"
                        {...field}
                      >
                        <option value="approved">Выплачено</option>
                        <option value="rejected">Отказ</option>
                        <option value="pending">Ожидание</option>
                      </select>
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
        </Modal>
      )}
    </div>
  );
}
