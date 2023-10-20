import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import server from "../../server";

export const loginAuth = createAsyncThunk("admin/auth", async (query) => {
    try {
        const response = await server.post(`/signin`, {
            email: query.email,
            password: query.password,
        })
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const fetchAdminData = createAsyncThunk("admin/data", async () => {
    try {
        const response = await server.get(`/admin`)
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const logout = createAsyncThunk("admin/logout", async () => {
    try {
        const response = await server.get(`/logout`)
        return response;
    } catch (err) {
        return err.response.data;
    }
});

export const refreshToken = createAsyncThunk("admin/refresh", async () => {
    try {
        const response = await server.get(`/refresh`)
        return response;
    } catch (err) {
        return err.response.data;
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: {},
        userToken: null,
        isError: null,
        status: null,
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        // admin auth
        builder.addCase(loginAuth.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(loginAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                localStorage.access_token = action.payload.data.accessToken;
                state.userToken = action.payload.data.accessToken;
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(loginAuth.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // admin data
        builder.addCase(fetchAdminData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAdminData.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.userInfo = {
                    username: action.payload.data.username,
                    email: action.payload.data.email,
                    phone: action.payload.data.phone,
                    avatar: action.payload.data.avatar,
                    role: action.payload.data.role,
                };
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(fetchAdminData.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // log out
        builder.addCase(logout.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 200) {
                state.userInfo = {};
                state.userToken = localStorage.removeItem('access_token');
                state.isError = null;
            } else {
                state.isError = true;
            }
        });
        builder.addCase(logout.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
        // refresh token
        builder.addCase(refreshToken.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(refreshToken.fulfilled, (state, action) => {
            state.isLoading = false;
            console.log('aaaaaaaaaaaaaaaaaaaaa', action.payload)
        });
        builder.addCase(refreshToken.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    },
})

export default userSlice.reducer;