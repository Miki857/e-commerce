import { createSlice } from "@reduxjs/toolkit";

const currentProducts = createSlice({
    name: "currentProducts",
    initialState: [],
    reducers: {
        setCurrentProducts: (_, action) => action.payload
    }
});

export const {setCurrentProducts} = currentProducts.actions;

export default currentProducts.reducer;