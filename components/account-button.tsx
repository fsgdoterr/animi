'use client';

import AuthModal from "@/components/modals/auth-modal";
import Modal from "@/components/modals/modal";
import { useGetMeQuery } from "@/lib/frontend/store/api/auth-api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountButton() {
    const [isModalOpened, setIsModalOpened] = useState(false);
    const { data: user, isLoading } = useGetMeQuery();
    const router = useRouter();

    const clickHandler = () => {
        if(!user) return setIsModalOpened(true);

        router.push("/profile");
    }

    useEffect(() => {
        if(isModalOpened && user) setIsModalOpened(false);
    }, [user, isModalOpened]);

    return(
        <button
            className="w-full rounded-lg border border-(--bg-3) bg-(--bg-2) py-2 px-2 flex gap-2 items-center hover:bg-(--bg-3) cursor-pointer"
            onClick={clickHandler}
        >   
            <div className="animate-shimmer rounded-full w-14 h-14 border border-(--bg-3)" />
            <div className="flex flex-col items-start justify-start">
                <p className="text-sm">{user ? user.username : "Ви не авторизовані"}</p>
                <p className="text-xs text-mauve-400">{user ? "Перейти в профіль" : "Тицніть аби увійти"}</p>
            </div>

            <AuthModal isOpen={isModalOpened} closeCallback={() => setIsModalOpened(false)} />
        </button>
    );
}