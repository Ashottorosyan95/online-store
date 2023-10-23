import { createAsyncThunk } from "@reduxjs/toolkit";
import server from "../../server";


export const createProduct = createAsyncThunk("product/create", async (formData) => {
    try {
        const response = await server.post('/product/create', formData);
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const fetchAllProducts = createAsyncThunk("product/getAll", async (query) => {
    try {
        const response = await server.get(`/product/list`, {
            params: {
                page: query.page || 1,
                limit: query.limit
            },
        });
        return response;
    } catch (err) {
        return err.response.data;
    }
});