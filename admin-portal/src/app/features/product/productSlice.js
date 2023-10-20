import { createSlice } from "@reduxjs/toolkit";
import { createProduct } from "./productApis";



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
            // if (action.payload?.status === 201) {
            //     state.categories = action.payload.data.categories;
            //     state.count = action.payload.data.totalCount;
            //     state.curentPage = action.payload.data.curentPage;
            //     state.isError = null;
            // } else if (action.payload?.status === 200) {
            //     const catIndex = state.categories.findIndex((cat) => cat._id === action.payload.data.category._id);
            //     if (catIndex !== -1) {
            //         state.categories[catIndex] = action.payload.data.category;
            //         state.isError = null;
            //     }
            // } else {
            //     state.isError = true;
            // }
        });
        builder.addCase(createProduct.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    },
})

export default productSlice.reducer;