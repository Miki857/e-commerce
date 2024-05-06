import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const allCategories = createSlice({
    name: "allCategories",
    initialState: [],
    reducers: {
        getAllCategories: (value, action) => action.payload,
    }
});

export const {getAllCategories} = allCategories.actions;

export default allCategories.reducer;

//REDUX HUNK:
export const getAllCategoriesHunk = (url) => (dispatch) => {
    axios.get(url)
        .then(res => dispatch(getAllCategories(res.data)))
        .catch(err => console.log(err))
}