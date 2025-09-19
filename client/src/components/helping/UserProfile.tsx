"use client";

import UserProfileStore from "@/store/userStore";
import { User } from "@/types/users";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      <div className="bg-zinc-300 border hover:border-zinc-800 cursor-pointer transition-all h-10 w-10 rounded-full flex items-center justify-center">
        {user?.username?.slice(0, 2).toUpperCase()}
      </div>
    </AvatarWrapper>
  );
}

const AvatarWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed w-full top-8 left-0 flex justify-end pr-8">
      {children}
    </div>
  );
};

export default UserProfile;
