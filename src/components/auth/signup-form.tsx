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
import { signUpSchema, SignUpSchemaType } from "@/lib/zod-schema";
import signUpSideImage from "../../../public/signup-side-img.jpg";

export function Signup() {
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (values: SignUpSchemaType) => {
    console.log(values);
  };

  return (
    <div className="h-full max-h-[30rem] w-full max-w-3xl rounded-md bg-neutral-800 p-4">
      <div className="grid h-full w-full rounded-md md:grid-cols-2">
        {/* Left Side*/}
        <div className="col-span-1 mb-5 w-full overflow-hidden rounded-md md:mb-0">
          <Image
            src={signUpSideImage}
            alt="signup side image"
            width={500}
            height={500}
            className="object-contain"
            priority
            blurDataURL=""
            placeholder="blur"
          />
        </div>

        {/* Right Side*/}
        <div className="col-span-1 flex w-full flex-col items-center justify-center">
          <div className="mb-10 flex flex-col items-center space-y-5">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <h2 className="text-lg font-semibold">COMPANY NAME</h2>
          </div>

          <Form {...form}>
            <form
              className="mb-2 flex w-full max-w-sm flex-col space-y-4 px-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Full Name"
                        {...field}
                        type="text"
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
                Sign Up
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm font-normal text-neutral-400">
            Already have an account!{" "}
            <span className="cursor-pointer font-medium text-white hover:underline">
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
