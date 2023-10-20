import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import server from "../../server";

export const fetchAllUsers = createAsyncThunk("user/getAll", async (query) => {
    try {
        const response = await server.get(`/get-all-users`, {
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

export const fetchAllUsersCount = createAsyncThunk("user/users", async () => {
    try {
        const response = await server.get('/get-all-dashboard-users');
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const editUser = createAsyncThunk("user/edit", async (query) => {
    try {
        const response = await server.put(`/edit-user/${query.userId}`, {
            editData: query.data
        });
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const deleteUser = createAsyncThunk("user/delete", async (query) => {
    try {
        const response = await server.delete(`/delete-user/${query.userId}`, {
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

export const createUser = createAsyncThunk("user/create", async (query) => {
    try {
        const response = await server.post('/create', {
            params: {
                page: query.page || 1,
                limit: query.limit
            },
            data: {
                user: {
                    username: query.user.username,
                    email: query.user.email,
                    phone: query.user.phone,
                    password: query.user.password,
                }
            }
        });
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const searchUser = createAsyncThunk("user/search", async (query) => {
    try {
        const response = await server.get('/serach', {
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

export const deleteCheckUsers = createAsyncThunk("user/check-users", async (query) => {
    try {
        const response = await server.delete('/delete-check-user', {
            params: {
                page: query.page || 1,
                limit: query.limit,
            },
            data: {
                users: query.usersData
            }
        });
        return response;
    } catch (err) {
        return err.response.data;
    }
});

const allUsersSlice = createSlice({
    name: 'allUsers',
    initialState: {
        users: [],
        count: null,
        isLoading: false,
        curentPage: null,
        isError: null,
        userCount: null
    },
    reducers: {},
    extraReducers: (builder) => {
        // get all users
        builder.addCase(fetchAllUsers.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.users = action.payload.data.users;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(fetchAllUsers.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // edit user
        builder.addCase(editUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(editUser.fulfilled, (state, action) => {
            state.isLoading = false;
            const userIndex = state.users.findIndex((user) => user._id === action.payload.data._id);
            if (action.payload?.status === 200 && userIndex !== -1) {
                state.users[userIndex] = action.payload.data;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(editUser.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // delete user
        builder.addCase(deleteUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.users = action.payload.data.usersData;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(deleteUser.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // create user
        builder.addCase(createUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createUser.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 201) {
                state.users = action.payload.data.user;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(createUser.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // search user
        builder.addCase(searchUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(searchUser.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.users = action.payload.data.users;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(searchUser.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // users dashboard
        builder.addCase(fetchAllUsersCount.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAllUsersCount.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.userCount = action.payload.data.usersCount;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(fetchAllUsersCount.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // delete check users
        builder.addCase(deleteCheckUsers.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteCheckUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            console.log('action', action.payload);
            if (action.payload?.status === 200) {
                state.users = action.payload.data.usersData;
                state.count = action.payload.data.totalCount;
                state.curentPage = action.payload.data.curentPage;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(deleteCheckUsers.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    },
})

export default allUsersSlice.reducer;