import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axiosInstance";

export const GetUserData = createAsyncThunk(
    "global/getUserData",
    async (token) => {
        try {
            const Response = await axiosInstance.post(`/auth/google`, {
                idToken:token
            });
            console.log("Response from server:", Response.data);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);
