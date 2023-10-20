import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './features/user/userSlice';
import allUsersReducer from './features/user/allUsersSlice';
import blokReducer from './features/blog/blogSlice';
import categoryReducer from './features/category/categorySlice';


export const store = configureStore({
    reducer: {
        user: usersReducer,
        allUsers: allUsersReducer,
        blog: blokReducer,
        category: categoryReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["meta.arg", "payload"],
      },
    }),
});