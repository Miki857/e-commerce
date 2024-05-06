import { createSlice } from "@reduxjs/toolkit";

const sumaTotal = createSlice({
    name: "sumaTotal",
    initialState: 0,
    reducers: {
        setSumaTotal: (_, action) => action.payload,
    }
});

export const {setSumaTotal} = sumaTotal.actions;

export default sumaTotal.reducer;