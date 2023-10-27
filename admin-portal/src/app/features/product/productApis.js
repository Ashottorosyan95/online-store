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

export const skuValidate = createAsyncThunk("product/sku", async (data) => {
    try {
        const response = await server.post('/product/sku', {data});
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const fetchAllProducts = createAsyncThunk("product/getList", async (query) => {
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

export const fetchListProducts = createAsyncThunk("product/getAll", async () => {
    try {
        const response = await server.get('/product/all');
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const getProductById = createAsyncThunk("product/get-by-id", async (query) => {
    try {
        const response = await server.get(`product/one/${query.productId}`);
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const searchProduct = createAsyncThunk("product/search", async (query) => {
    try {
        const response = await server.get(`product/serach`, {
            params: {
                page: query.page || 1,
                limit: query.limit,
                query: query.searchData
            },
        });
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const filterProduct = createAsyncThunk("product/sort", async (query) => {
    try {
        const response = await server.get('product/sort', {
            params: {
                page: query.page || 1,
                limit: query.limit,
                sort: query.filterData
            },
        });
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const editProduct = createAsyncThunk("product/edit", async (query) => {
    try {
        const response = await server.put(`product/edit/${query.productId}`, query.data);
        return response;
    } catch (err) {
        return err.response.data;
    }
});