"use client";
import AdminPageHeader from "@/components/admin/admin-page-header";
import CreateUserForm from "@/components/admin/users/create-user-form";
import UsersList from "@/components/admin/users/users-list";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
    const router = useRouter();

    const onEdit = (userId: number) => {
        router.push("/admin/users/" + userId);
    };

    return (
        <div className="w-full h-full p-8 flex flex-col gap-4">
            <AdminPageHeader
                title="Користувачі"
                subtitle="Сторінка для керування користувачами"
                icon={<Users size={64} />}
            />
            <hr />
            <CreateUserForm />
            <hr />
            <UsersList onEdit={onEdit} />
        </div>
    );
}
