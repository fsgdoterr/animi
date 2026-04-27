import AuthForm from "@/components/forms/auth-form";
import RegisterForm from "@/components/forms/register-form";
import Modal from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
    isOpen: boolean;
    closeCallback: () => void;
}

export default function AuthModal({ isOpen, closeCallback }: Props) {
    const [isAuth, setIsAuth] = useState(true);
    return(
        <Modal
            isOpen={isOpen}
            closeCallback={closeCallback}
            className="w-128 bg-(--bg-1) py-4 px-8 rounded-lg border border-(--bg-2)"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{isAuth ? "Авторизація" : "Реєстрація"}</h2>
                <button onClick={closeCallback} className="text-mauve-400 hover:text-mauve-200 cursor-pointer">
                    &#10005;
                </button>
            </div>
            {isAuth ? <AuthForm /> : <RegisterForm />}
            <p className="text-sm flex items-center gap-1 mt-4">
                {isAuth ? "Ще немає акаунту?" : "Вже маєте акаунт?"} {" "}
                <Button onClick={() => setIsAuth(!isAuth)} variant="text" className="p-0">
                    {isAuth ? "Зареєструватися" : "Увійти"}
                </Button>
            </p>
        </Modal>
    );
}