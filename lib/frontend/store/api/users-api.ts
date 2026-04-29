import { User } from "@/lib/frontend/store/api/auth-api";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export type UserSortField = "id" | "username" | "email" | "createdAt" | "ratingsCount";
export type SortOrder = "asc" | "desc";

export type UserWithCounts = User & {
    _count: {
        ratings: number;
    };
};

interface GetUsersResponse {
    ok: boolean;
    users: UserWithCounts[];
    meta: {
        hasMore: boolean;
        nextCursor: number | null;
    };
}

interface GetUsersArg {
    limit?: number;
    cursor?: number | null;
    sortBy?: UserSortField;
    sortOrder?: SortOrder;
}

interface GetUserResponse {
    ok: boolean;
    user: UserWithCounts;
}

interface UpdateUserArg {
    id: number;
    body: {
        username?: string;
        email?: string;
        password?: string;
        permissions?: string[];
    };
}

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/users" }),
    tagTypes: ["Users", "User"],

    endpoints: (builder) => ({
        getUsers: builder.query<GetUsersResponse, GetUsersArg | void>({
            query: (arg) => {
                const limit = arg?.limit ?? 20;
                const cursor = arg?.cursor;
                const sortBy = arg?.sortBy ?? "id";
                const sortOrder = arg?.sortOrder ?? "desc";

                const params = new URLSearchParams();
                params.set("limit", String(limit));
                params.set("sortBy", sortBy);
                params.set("sortOrder", sortOrder);

                if (cursor) {
                    params.set("cursor", String(cursor));
                }

                return `/?${params.toString()}`;
            },

            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                const sortBy = queryArgs?.sortBy ?? "id";
                const sortOrder = queryArgs?.sortOrder ?? "desc";
                return `${endpointName}-${sortBy}-${sortOrder}`;
            },

            merge: (currentCache, newData, { arg }) => {
                const cursor = arg?.cursor;

                if (!cursor) {
                    return newData;
                }

                currentCache.users.push(...newData.users);
                currentCache.meta = newData.meta;
            },

            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.cursor !== previousArg?.cursor;
            },

            providesTags: ["Users"],
        }),

        getUser: builder.query<UserWithCounts, number>({
            query: (id) => `/${id}`,
            transformResponse: (response: GetUserResponse) => response.user,
            providesTags: (_result, _error, id) => [{ type: "User", id }],
        }),

        createUser: builder.mutation<UserWithCounts, UpdateUserArg["body"] & { password: string }>({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            transformResponse: (response: { ok: boolean; user: UserWithCounts }) => response.user,
            invalidatesTags: ["Users"],
        }),

        updateUser: builder.mutation<UserWithCounts, UpdateUserArg>({
            query: ({ id, body }) => ({
                url: `/${id}`,
                method: "PATCH",
                body,
            }),
            transformResponse: (response: { ok: boolean; user: UserWithCounts }) => response.user,
            invalidatesTags: (_result, _error, { id }) => ["Users", { type: "User", id }],
        }),

        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useLazyGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApi;