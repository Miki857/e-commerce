import { createSlice } from "@reduxjs/toolkit";

const loading = createSlice({
    name: "loading",
    initialState: true,
    reducers: {
        setLoading: (_, action) => action.payload
    }
});

export const {setLoading} = loading.actions;

export default loading.reducer;