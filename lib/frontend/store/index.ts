import { authApi } from "@/lib/frontend/store/api/auth-api";
import { usersApi } from "@/lib/frontend/store/api/users-api";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, usersApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;