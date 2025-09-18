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
import { MTInfo } from "@/types/brokers";
import { Input } from "../ui/input";
import ImageInput from "../ImageInput";
import { Button } from "../ui/button";
import { TagInput } from "emblor";
import TagInputComponent from "../ui/TagInput";

const formSchema = z.object({
  licenses: z.array(z.string()),
  mt4Servers: z.string(),
  mt5Servers: z.string(),
  avgExecutionSpeed: z.string(),
  platforms: z
    .object({
      logo: z.string(),
      name: z.string(),
      rating: z.string(),
    })
    .array(),
});

function CreateLicense({
  children,
  initialData,
  setFormValueOnSubmit,
}: {
  children: React.ReactNode;
  initialData?: MTInfo;
  setFormValueOnSubmit: (values: MTInfo) => void;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licenses: initialData?.licenses ?? [],
      avgExecutionSpeed: initialData?.avgExecutionSpeed ?? "",
      mt4Servers: initialData?.mt4Servers ?? "",
      mt5Servers: initialData?.mt5Servers ?? "",
      ...(initialData?.platforms
        ? {
            platforms: initialData.platforms as {
              logo: string;
              name: string;
              rating: string;
            }[],
          }
        : {}),
    },
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
          <DialogTitle>{initialData ? "Update" : "Create"} License</DialogTitle>
          <DialogDescription>This will update data locally</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="sm:flex space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="mt4Servers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MT5 Servers</FormLabel>
                    <FormControl>
                      <ImageInput
                        className="size-40 min-h-40"
                        value={field.value}
                        setValue={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4 w-full">
              <FormField
                control={form.control}
                name="mt5Servers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MT5 Servers</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avgExecutionSpeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average execution speed</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <TagInputComponent
                        tags={field.value.map((v) => ({ id: v, text: v }))}
                        setTags={field.onChange}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="platforms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <TagInputComponent
                        tags={field.value.map((v) => ({ id: v, text: v }))}
                        setTags={field.onChange}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {initialData ? "Update" : "Create"} License
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLicense;
