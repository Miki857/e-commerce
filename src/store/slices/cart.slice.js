import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import getConfig from './utils/getConfig';

const cart = createSlice({
    name: 'cart',
    initialState: null,
    reducers: {
        setCart: (_, action) => action.payload
    }
})

export const getCartThunk = () => (dispatch) => {//Obtener carrito:
    axios.get('https://e-commerce-api-v2.academlo.tech/api/v1/cart', getConfig())
        .then(res => {
            dispatch(setCart(res.data));
        })
        .catch(err => console.log(err));
}

export const addToCartThunk = (product) => (dispatch) => {//Agregar al carrito:
    axios.post('https://e-commerce-api-v2.academlo.tech/api/v1/cart', product, getConfig())
        .then(_ => getCartThunk()(dispatch))//Volvemos a pedir el carrito con los datos actualizados.
        .catch(err => console.log(err));
}

export const deleteFromCartThunk = (id) => (dispatch) => {//Borrar del carrito:
    axios.delete('https://e-commerce-api-v2.academlo.tech/api/v1/cart/'+id, getConfig())
        .then(_ => getCartThunk()(dispatch))//Volvemos a pedir el carrito con los datos actualizados.
        .catch(err => console.log(err));
}

export const modifyQuantityThunk = (id, quantity) => dispatch => {//Actualizar quantity:
    axios.put('https://e-commerce-api-v2.academlo.tech/api/v1/cart/'+id, quantity, getConfig())
        .then(_ => getCartThunk()(dispatch))//Volvemos a pedir el carrito con los datos actualizados.
        .catch(err => console.log(err));
}

export const { setCart } = cart.actions;

export default cart.reducer;
