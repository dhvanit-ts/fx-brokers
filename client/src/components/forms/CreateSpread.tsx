"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SpreadInfo } from "@/types/brokers";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
  tradingPair: z.string(),
  buy: z.string(),
  account: z.string(),
  spread: z.string(),
  avgSpreadDay: z.string(),
  longSwap: z.string(),
  shortSwap: z.string(),
});

function CreateSpread({
  children,
  initialData,
  setFormValueOnSubmit,
}: {
  children: React.ReactNode;
  initialData?: SpreadInfo;
  setFormValueOnSubmit: (values: SpreadInfo) => void;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const newValue = {
      ...values,
      _id: initialData?._id ?? Date.now().toString(),
    };

    setFormValueOnSubmit(newValue);
    setOpen(false);
    console.log(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Update" : "Create"} Spread</DialogTitle>
          <DialogDescription>This will update data locally</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tradingPair"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trading pair</FormLabel>
                  <FormControl>
                    <Input placeholder="Trading pair" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="buy"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Buy</FormLabel>
                    <FormControl>
                      <Input placeholder="Buy" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avgSpreadDay"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Average spread day</FormLabel>
                    <FormControl>
                      <Input placeholder="Avg spread day" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <FormControl>
                    <Input placeholder="Account" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="longSwap"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Long swap</FormLabel>
                    <FormControl>
                      <Input placeholder="Long swap" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortSwap"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Short swap</FormLabel>
                    <FormControl>
                      <Input placeholder="Short swap" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">
              {initialData ? "Update" : "Create"} Spread
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSpread;
