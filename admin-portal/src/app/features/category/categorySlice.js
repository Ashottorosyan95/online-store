import server from "../../server";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const createCategory = createAsyncThunk("category/create", async (query) => {
    try {
        const response = await server.post('/create-category', {
            params: {
                page: query.page || 1,
                limit: query.limit
            },
            data: query.category,
            isEdit: query.isEdit,
            id: query.id
        });
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const fetchAllCategoies = createAsyncThunk("category/getAll", async (query) => {
    try {
        const response = await server.get(`/get-all-category`, {
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

export const fetchAllCategoiesData = createAsyncThunk("category/getAllData", async () => {
    try {
        const response = await server.get(`/get-categories`);
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const deleteCategoryByid = createAsyncThunk("category/delete", async (query) => {
    try {
        const response = await server.delete(`/delete-category/${query.categoryId}`, {
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

export const categorySearch = createAsyncThunk("category/search", async (query) => {
    try {
        const response = await server.delete('/category-serach', {
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


const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        categoriesData: [],
        count: null,
        isLoading: false,
        curentPage: null,
        isError: null,
        categoriesCount: null
    },
    reducers: {},
    extraReducers: (builder) => {
        // create blog
        builder.addCase(createCategory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 201) {
                state.categories = action.payload.data.categories;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else if (action.payload?.status === 200) {
                const catIndex = state.categories.findIndex((cat) => cat._id === action.payload.data.category._id);
                if (catIndex !== -1) {
                    state.categories[catIndex] = action.payload.data.category;
                    state.isError = null;
                }
            } else {
                state.isError = true;
            }
        });
        builder.addCase(createCategory.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // get all category
        builder.addCase(fetchAllCategoies.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAllCategoies.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.categories = action.payload.data.categories;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(fetchAllCategoies.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // delete category
        builder.addCase(deleteCategoryByid.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteCategoryByid.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.categories = action.payload.data.categories;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(deleteCategoryByid.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // all data
        builder.addCase(fetchAllCategoiesData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAllCategoiesData.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.categoriesData = action.payload.data.categories;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(fetchAllCategoiesData.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // search
        builder.addCase(categorySearch.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(categorySearch.fulfilled, (state, action) => {
            state.isLoading = false;
            console.log('action.', action.payload);
            // if (action.payload?.status === 200) {
            //     state.categoriesData = action.payload.data.categories;
            //     state.isError = null;
            // } else {
            //     state.isError = true;
            // }
        });
        builder.addCase(categorySearch.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    },
})

export default categorySlice.reducer;