"use client";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableColumn } from "@/components/ui/table";
import { useIntersectionObserver } from "@/lib/frontend/hooks/use-intersection-observer";
import {
    SortOrder,
    UserSortField,
    useDeleteUserMutation,
    useLazyGetUsersQuery,
} from "@/lib/frontend/store/api/users-api";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface UserRow {
    id: number;
    username: string;
    email: string;
    watchedAnimeCount: number;
    ratingsCount: number;
    createdAt: string;
}

interface Props {
    onEdit: (id: number) => void;
}

function SortHeader({
    label,
    field,
    sortBy,
    sortOrder,
    onSort,
}: {
    label: string;
    field: UserSortField;
    sortBy: UserSortField;
    sortOrder: SortOrder;
    onSort: (field: UserSortField) => void;
}) {
    const isActive = sortBy === field;
    return (
        <button
            type="button"
            className="inline-flex items-center gap-1 cursor-pointer hover:text-(--text-1) transition"
            onClick={() => onSort(field)}
        >
            {label}
            {isActive ? (
                sortOrder === "desc" ? (
                    <ChevronDown size={14} />
                ) : (
                    <ChevronUp size={14} />
                )
            ) : (
                <ChevronsUpDown size={14} className="opacity-40" />
            )}
        </button>
    );
}

export default function UsersList({ onEdit }: Props) {
    const [sortBy, setSortBy] = useState<UserSortField>("id");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const [getUsers, { isLoading, data }] = useLazyGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const { ref, isIntersecting } = useIntersectionObserver({});

    const handleSort = (field: UserSortField) => {
        if (field === sortBy) {
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const loadUsers = async (cursor: number | null = null) => {
        try {
            await getUsers({ limit: 20, cursor, sortBy, sortOrder }).unwrap();
        } catch (e) {
            console.error("ERROR", e);
        }
    };

    // Reset and reload when sort changes
    useEffect(() => {
        loadUsers(null);
    }, [sortBy, sortOrder]);

    useEffect(() => {
        if (isIntersecting && data?.meta?.hasMore) {
            loadUsers(data.meta.nextCursor);
        }
    }, [isIntersecting]);

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            "Ви впевнені, що хочете видалити цього користувача?",
        );
        if (!confirmed) return;

        try {
            await deleteUser(id).unwrap();
        } catch (e) {
            console.error("Delete error", e);
        }
    };

    const sortProps = { sortBy, sortOrder, onSort: handleSort };

    const columns: DataTableColumn<UserRow>[] = [
        {
            id: "id",
            header: <SortHeader label="ID" field="id" {...sortProps} />,
            accessorKey: "id",
            width: "1px",
        },
        {
            id: "username",
            header: <SortHeader label="Логін" field="username" {...sortProps} />,
            accessorKey: "username",
        },
        {
            id: "email",
            header: <SortHeader label="Email" field="email" {...sortProps} />,
            accessorKey: "email",
        },
        {
            id: "watchedAnimeCount",
            header: "Переглянуто",
            accessorKey: "watchedAnimeCount",
            align: "center",
            width: "140px",
        },
        {
            id: "ratingsCount",
            header: (
                <SortHeader label="Оцінок" field="ratingsCount" {...sortProps} />
            ),
            accessorKey: "ratingsCount",
            align: "center",
            width: "120px",
        },
        {
            id: "createdAt",
            header: (
                <SortHeader label="Створений" field="createdAt" {...sortProps} />
            ),
            cell: (user) => (
                <div className="whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString("uk-UA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
            ),
            align: "center",
            width: "1px",
        },
        {
            id: "actions",
            header: "Дії",
            align: "right",
            width: "260px",
            cell: (user) => (
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(user.id)}
                    >
                        Редагувати
                    </Button>

                    <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                    >
                        Видалити
                    </Button>
                </div>
            ),
        },
    ];

    const users =
        data?.users.map((user) => ({
            ...user,
            watchedAnimeCount: 0,
            ratingsCount: user._count.ratings,
        })) ?? [];

    return (
        <>
            <DataTable
                columns={columns}
                data={users}
                getRowKey={(user) => user.id}
                isLoading={isLoading}
                emptyText="Користувачів поки немає"
            />
            <div ref={ref}></div>
        </>
    );
}
