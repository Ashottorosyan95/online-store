import { createSlice } from "@reduxjs/toolkit";
import { createProduct, fetchAllProducts } from "./productApis";



const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        productData: [],
        count: null,
        isLoading: false,
        curentPage: null,
        isError: null,
        productCount: null
    },
    reducers: {},
    extraReducers: (builder) => {
        // create product
        builder.addCase(createProduct.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 201) {
                state.products = action.payload.data.products;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(createProduct.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // get all products
        builder.addCase(fetchAllProducts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.products = action.payload.data.products;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(fetchAllProducts.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    },
})

export default productSlice.reducer;