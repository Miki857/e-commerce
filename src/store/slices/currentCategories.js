import { createSlice } from "@reduxjs/toolkit";

const categories = createSlice({
    name: "categories",
    initialState: [],
    reducers: {
        setCategories: (value, action) => action.payload,
    }
});

export const {setCategories} = categories.actions;

export default categories.reducer;