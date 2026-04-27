import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
    id: number;
    email: string;
    username: string;
    permissions: string[];
    createdAt: string;
}

interface AuthResponse {
    ok: boolean;
    user: User;
}

interface LogoutResponse {
    ok: boolean;
    message: string;
}

interface SigninRequest {
    username: string;
    password: string;
}

interface SignupRequest {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/auth" }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => "/me",
            transformResponse: (response: AuthResponse) => response.user,
            providesTags: ["User"],
        }),
        signin: builder.mutation<User, SigninRequest>({
            query: (body) => ({
                url: "/signin",
                method: "POST",
                body,
            }),
            transformResponse: (response: AuthResponse) => response.user,
            invalidatesTags: ["User"],
        }),
        signup: builder.mutation<User, SignupRequest>({
            query: (body) => ({
                url: "/signup",
                method: "POST",
                body,
            }),
            transformResponse: (response: AuthResponse) => response.user,
            invalidatesTags: ["User"],
        }),
        logout: builder.query<LogoutResponse, void>({
            query: () => "/logout",
            providesTags: ["User"],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(authApi.util.resetApiState());
                } catch {}
            },
        })
    }),
});

export const {
    useGetMeQuery,
    useSigninMutation,
    useSignupMutation,
    useLazyLogoutQuery
} = authApi;
