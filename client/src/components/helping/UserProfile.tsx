"use client";

import { cn } from "@/lib/utils";
import UserProfileStore from "@/store/userStore";
import { User } from "@/types/users";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

function UserProfile() {
  const setUser = UserProfileStore((state) => state.setUser);
  const user = UserProfileStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetcher.get<{ data: User }>({
          endpointPath: "/users/me",
          statusShouldBe: 200,
          onError: () => {
            router.push("/auth/login");
          },
        });
        if (data) setUser(data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      }
    })();
  }, [setUser, router]);

  if (!user)
    return (
      <AvatarWrapper>
        <div className="bg-zinc-400 w-fit rounded-full">
          <div className="animate-pulse h-10 w-10 rounded-full bg-gray-200"></div>
        </div>
      </AvatarWrapper>
    );

  return (
    <AvatarWrapper>
      <div className="bg-zinc-300 border select-none hover:border-zinc-800 font-semibold cursor-pointer transition-all h-10 w-10 rounded-full flex items-center justify-center">
        {user?.username?.slice(0, 2).toUpperCase()}
      </div>
    </AvatarWrapper>
  );
}

const AvatarWrapper = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed w-full top-8 left-0 flex justify-end pr-8 z-50">
      <div onClick={() => setOpen(!open)} className="relative">
        <div
          className={cn(
            "transition-all absolute right-2 top-2 z-40 duration-200 ease-in-out rounded-3xl bg-zinc-700",
            open ? "h-80 w-40" : "size-0 bg-zinc-200"
          )}
        ></div>
        <div className="bg-zinc-300 absolute right-0 top-0 rounded-full z-50 min-w-8 min-h-8">
          {open ? (
            <div className="bg-zinc-300 z-50 border hover:border-zinc-800 cursor-pointer transition-all h-8 w-8 text-base rounded-full flex items-center justify-center">
              <IoClose />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
