import server from "./server";

export async function register(data) {
    try {
        const result = await server.post(`/signup`, {
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: data.password,
        })
        return result;
    } catch (error) {
        return error;
    }
}

export async function login(data) {
    try {
        const result = await server.post(`/signin`, {
            email: data.email,
            password: data.password,
        })
        return result;
    } catch (error) {
        return error;
    }
}