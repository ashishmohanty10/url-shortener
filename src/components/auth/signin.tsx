"use client";

import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signInSchemaType } from "@/lib/zod-schema";

export function Signin() {
  const form = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (values: signInSchemaType) => {
    console.log(values);
  };

  return (
    <div className="h-[30rem] w-full max-w-3xl rounded-md bg-neutral-800 p-4">
      <div className="grid h-full w-full rounded-md md:grid-cols-2">
        {/* Left */}
        <div className="col-span-1 mb-5 w-full overflow-hidden rounded-md md:mb-0">
          <Image
            src={
              "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="signin display image"
            width={500}
            height={500}
            className="object-contain"
          />
        </div>

        {/* Right */}
        <div className="col-span-1 flex w-full flex-col items-center justify-center p-2">
          <div className="mb-10 flex flex-col items-center space-y-5">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <h2 className="text-lg font-semibold">COMPANY NAME</h2>
          </div>

          <Form {...form}>
            <form
              className="mb-2 flex flex-col space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        type="email"
                        className={cn(
                          "w-full rounded-md border border-neutral-700 transition-colors",
                          "focus:border-neutral-500 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200",
                          "placeholder:text-neutral-300",
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="group flex items-center rounded-md border border-neutral-700 pr-2 focus-within:border-neutral-500 focus-within:bg-neutral-900">
                        <Input
                          placeholder="Password"
                          {...field}
                          className="border-none placeholder:text-neutral-300"
                          type={showPassword ? "text" : "password"}
                        />

                        {showPassword ? (
                          <EyeOff
                            onClick={handleShowPassword}
                            className={cn(
                              "cursor-pointer text-neutral-400 transition-colors hover:text-white",
                              showPassword && "text-white",
                            )}
                          />
                        ) : (
                          <Eye
                            onClick={handleShowPassword}
                            className="cursor-pointer text-neutral-400 transition-colors hover:text-white"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-neutral-700 text-sm font-medium transition-colors hover:bg-neutral-600"
              >
                Sign In
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm font-normal text-neutral-400">
            Don&apos;t have an account!{" "}
            <span className="cursor-pointer font-medium text-white hover:underline">
              Create Now
            </span>{" "}
            for free
          </p>
        </div>
      </div>
    </div>
  );
}
