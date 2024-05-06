import { createSlice } from "@reduxjs/toolkit";

const cartProducts = createSlice({
    name: "cartProducts",
    initialState: [],
    reducers: {
        setCartProducts: (value, action) => action.payload,// SIn las lleves no funcion XD.
    }
});

export const {setCartProducts} = cartProducts.actions;

export default cartProducts.reducer;