import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "./loading.slice";

const allProducts = createSlice({
    name: "allProducts",
    initialState: [],
    reducers: {
        getAllProducts: (_, action) => action.payload
    }
});

export const {getAllProducts} = allProducts.actions;

export default allProducts.reducer;

//REDUX HUNK:
export const getAllProductHunk = (url) => (dispatch) => {
    axios.get(url)
        .then(res => {dispatch(getAllProducts(res.data)); dispatch(setLoading(false));})
        .catch(err => console.log(err))
}