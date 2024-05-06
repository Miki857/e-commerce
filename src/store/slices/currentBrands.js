import { createSlice } from "@reduxjs/toolkit";

const currentBrands = createSlice({
    name: "currentBrands",
    initialState: [],
    reducers: {
        setBrands: (value, action) => action.payload
    }
});

export const {setBrands} = currentBrands.actions;

export default currentBrands.reducer;