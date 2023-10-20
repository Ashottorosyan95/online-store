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