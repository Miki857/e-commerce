import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "./loading.slice";

const user = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        setUser: (value, action) => action.payload
    }
});

export const {setUser} = user.actions;

export default user.reducer;

//REDUX HUNK:
export const getUserHunk = (url) => (dispatch) => {//Get User.
    axios.get(url)
        .then(/*res => console.log(red.data)*/)
        .catch(err => console.log(err))
        .finally(() => dispatch(setLoading(false)));
}

export const createUserHunk = (url) => (data, dispatch) => {//Create User.
    axios.post(url, data)
        .then(res => {
            //Automaticamente iniciamos sesion:
            //console.log("USer Created: ", res.data);
        })
        .catch(err => console.log(err))
        .finally(() => dispatch(setLoading(false)));
}

export const loginUserHunk = (url) => (data, dispatch) => {//Login User.
    axios.post(url, data)
        .then(res => {
            //GUARDAMOS EL 'token' Y EL 'username' EN EL LOCALSTORAGE:
            dispatch(setUser(res.data));
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userName", res.data.user.firstName + " " + res.data.user.lastName);
        })
        .catch(err => console.log(err))
        .finally(() => dispatch(setLoading(false)));
}