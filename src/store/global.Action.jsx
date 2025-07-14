import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axiosInstance";

export const GetUserData = createAsyncThunk(
    "global/getUserData",
    async (token) => {
        try {
            const Response = await axiosInstance.get(`/auth/user-data`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const GetWebsite = createAsyncThunk(
    "global/GetWebsite",
    async (token) => {
        try {
            const Response = await axiosInstance.get(`/dashboard/get-websites`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);


export const GetChatHistory = createAsyncThunk(
    "global/GetChatHistory",
    async () => {
        try {
            const token = localStorage.getItem('authToken');
            const Response = await axiosInstance.get(`/chat/chat-history`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const getTemplates = createAsyncThunk(
    "global/getTemplates",
    async ({ page = 1, limit = 8 }) => {
        try {
            const token = localStorage.getItem('authToken');
            const Response = await axiosInstance.get(`/dashboard/get-templates?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return {
                data: Response.data.data,
                totalCount: Response.data.total || 0,
                totalPages: Math.ceil(Response.data.total / limit),
                page: Number(page),
                limit: Number(limit)
            };
        } catch (err) {
            console.log("error", err);
            if (err) {
                throw err;
            }
        }
    }
);

export const getPublicTemplates = createAsyncThunk(
    "global/getPublicTemplates",
    async () => {
        try {
            const token = localStorage.getItem('authToken');
            const Response = await axiosInstance.get(`/dashboard/get-templates?page=1&limit=9`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return {
                data: Response.data.data,
            };
        } catch (err) {
            console.log("error", err);
            if (err) {
                throw err;
            }
        }
    }
);

export const sendMessageApi = async ({ data }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.post(`/chat/send`, {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("api data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}



export const redesignWebsite = async ({ data }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.post(`/redesign`, {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("api data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const createDocApi = async ({ data }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.post(`/create-docs`, {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("api data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const AiChatHistory = async ({ uuid }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.get(`/ai/history/${uuid}`, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("ai history data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const DeleteAiChatHistory = async ({ uuid }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.delete(`/ai/delete/${uuid}`, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("ai delete data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const updateWebsite = async ({ data }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.post(`/ai/update-website`, {
            ...data
        }, {

            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("ai delete data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const createBlogApi = async ({ data }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.post(`/create-blog`, {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("api data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const remixWebsite = async ({ data }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.post(`/remix`, {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("api data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const editWebsite = async ({ data }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.post(`/edit-page`, {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("api data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const addWebsitePage = async ({ data }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.post(`/add-page`, {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("api data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const updateHtmlFn = async ({ websiteId, updatedHtml }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.post(`/update-html`, {
            websiteId,
            updatedHtml
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("api data", Response);
        return Response;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const deleteApiKey = async ({ id }) => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.delete(`/dashboard/delete-key/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        console.log("api data", Response);
        return Response.data.key;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}


export const createGmailAccount = async ({ email, password, name }) => {
    try {
        const Response = await axiosInstance.post(`/auth/create-gmail-account`, {
            email,
            password,
            name
        });
        console.log("api data", Response);
        return Response.data.key;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const gmailLogin = async ({ email, password }) => {
    try {
        const Response = await axiosInstance.post(`/auth/gmail-login`, {
            email,
            password
        });
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const forgetPasswordApi = async ({ email }) => {
    try {
        const Response = await axiosInstance.post(`/auth/forget-password`, {
            email,
        });
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const resetPasswordApi = async ({ newPassword, token }) => {
    try {
        const Response = await axiosInstance.post(`/auth/reset-password`, {
            newPassword,
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the request headers
            }
        });
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const verifiyOtp = async ({ email, code, type }) => {
    try {
        const Response = await axiosInstance.post(`/auth/verifiy-otp`, {
            email,
            code,
            type
        });
        console.log("api data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}

export const deleteAllLogsApi = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const Response = await axiosInstance.delete(`/dashboard/delete-all-logs`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("api data", Response);
        return Response.data;
    } catch (err) {
        console.log("error", err);
        if (err) {
            throw err;
        }
    }
}


export const getApiKeys = createAsyncThunk(
    "global/createApiKey",
    async () => {
        try {
            const token = localStorage.getItem('authToken');
            console.log("token", token);
            const Response = await axiosInstance.get(`/dashboard/get-keys`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            console.log("error", err);
            if (err) {
                throw err;
            }
        }
    }
);


export const getLogs = createAsyncThunk(
    "global/getLogs",
    async ({ page = 1, limit = 10, appName = "shiva" }) => {
        try {
            const token = localStorage.getItem('authToken');
            console.log("token", token);
            const Response = await axiosInstance.get(`/dashboard/logs?page=${page}&appName=${appName}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data logs", Response);
            return Response.data;
        } catch (err) {
            console.log("error", err);
            if (err) {
                throw err;
            }
        }
    }
);

export const getStats = createAsyncThunk(
    "global/getStats",
    async () => {
        try {
            const token = localStorage.getItem('authToken');
            console.log("token", token);
            const Response = await axiosInstance.get(`/dashboard/stats`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);