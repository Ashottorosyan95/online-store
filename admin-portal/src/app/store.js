import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './features/user/userSlice';
import allUsersReducer from './features/user/allUsersSlice';
import blokReducer from './features/blog/blogSlice';
import categoryReducer from './features/category/categorySlice';
import productReducer from './features/product/productSlice';


export const store = configureStore({
    reducer: {
        user: usersReducer,
        allUsers: allUsersReducer,
        blog: blokReducer,
        category: categoryReducer,
        product: productReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["meta.arg", "payload"],
      },
    }),
});