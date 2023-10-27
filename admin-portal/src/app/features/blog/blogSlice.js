import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import server from "../../server";

export const createBlog = createAsyncThunk("blog/create", async (formData) => {
    try {
        const response = await server.post('/create-post', formData);
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const fetchAllBlogs = createAsyncThunk("blog/getAll", async (query) => {
    try {
        const response = await server.get(`/get-all-post`, {
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

export const searchBlog = createAsyncThunk("blog/search", async (query) => {
    try {
        const response = await server.get(`/post-serach`, {
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

export const getBlogById = createAsyncThunk("blog/get-by-id", async (query) => {
    try {
        const response = await server.get(`/post/${query.blogId}`);
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const deleteBlog = createAsyncThunk("blog/delete", async (query) => {
    try {
        const response = await server.delete(`/delete-blog/${query.blogId}`);
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const editBlog = createAsyncThunk("blog/edit", async (query) => {
    try {
        const response = await server.put(`/edit-blog/${query.blogId}`, query.data);
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const fetchAllBlogsCount = createAsyncThunk("blog/blogs", async () => {
    try {
        const response = await server.get('/get-all-dashboard-blogs');
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const filterBlog = createAsyncThunk("blog/filter", async (query) => {
    try {
        const response = await server.get(`/filter/${query.name}`, {
            params: {
                page: query.page || 1,
                limit: query.limit,
            },
        });
        return response;
    } catch (err) {
        return err.response.data;
    }
});


const blogSlice = createSlice({
    name: 'blok',
    initialState: {
        blogs: [],
        blogData: null,
        count: null,
        isLoading: false,
        curentPage: null,
        isError: null,
        bloksCount: null
    },
    reducers: {},
    extraReducers: (builder) => {
        // create blog
        builder.addCase(createBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createBlog.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 201) {
                state.blogs = action.payload.data.blog;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(createBlog.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // all blogs
        builder.addCase(fetchAllBlogs.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAllBlogs.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.blogs = action.payload.data.blogs;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(fetchAllBlogs.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // search blog
        builder.addCase(searchBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(searchBlog.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.blogs = action.payload.data.blogs;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(searchBlog.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // get blog by id
        builder.addCase(getBlogById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getBlogById.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.blogData = action.payload.data.blog;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(getBlogById.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // delete blog
        builder.addCase(deleteBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteBlog.fulfilled, (state, action) => {
            state.isLoading = false;
            console.log('action.payload', action.payload);
        });
        builder.addCase(deleteBlog.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // edit blog
        builder.addCase(editBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(editBlog.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.blogData = action.payload.data.blog;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(editBlog.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // blogs dashboard
        builder.addCase(fetchAllBlogsCount.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAllBlogsCount.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.bloksCount = action.payload.data.blogsCount;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(fetchAllBlogsCount.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // blogs filter
        builder.addCase(filterBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(filterBlog.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.blogs = action.payload.data.blogs;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(filterBlog.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    },
})

export default blogSlice.reducer;