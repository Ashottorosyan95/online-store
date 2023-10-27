import { createSlice } from "@reduxjs/toolkit";
import {
    createProduct,
    deleteProduct,
    editProduct,
    fetchAllProducts,
    fetchListProducts,
    filterProduct,
    getProductById,
    searchProduct
} from "./productApis";



const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        productData: null,
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
        // get product by id
        builder.addCase(getProductById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getProductById.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.productData = action.payload.data.product;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(getProductById.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // search product
        builder.addCase(searchProduct.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(searchProduct.fulfilled, (state, action) => {
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
        builder.addCase(searchProduct.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // sort product
        builder.addCase(filterProduct.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(filterProduct.fulfilled, (state, action) => {
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
        builder.addCase(filterProduct.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // edit product
        builder.addCase(editProduct.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(editProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.productData = action.payload.data.product;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(editProduct.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // all product
        builder.addCase(fetchListProducts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchListProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.products = action.payload.data.products;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(fetchListProducts.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // delete product
        builder.addCase(deleteProduct.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            // if (action.payload?.status === 200) {
            //     state.products = action.payload.data.products;
            //     state.isError = null;
            // } else {
            //     state.isError = true;
            // }
        });
        builder.addCase(deleteProduct.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    },
})

export default productSlice.reducer;