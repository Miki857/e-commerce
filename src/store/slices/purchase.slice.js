import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import getConfig from './utils/getConfig';
import { getCartThunk, setCart } from './cart.slice';
import { setLoading } from './loading.slice';

const purchases = createSlice({
    name: 'purchases',
    initialState: [],
    reducers: {
        setPurchases: (_, action) => action.payload
    }
})

export const getPurchasesThunk = () => (dispatch) => {//Obtener Carrito de DDBB:
    axios.get('https://e-commerce-api-v2.academlo.tech/api/v1/purchases', getConfig())
        .then(res => dispatch(setPurchases(res.data)))//Actualizaoms carrito de la app.
        .catch(err => console.log(err));
}

export const purchaseCartThunk = () => (dispatch) => {
    axios.post('https://e-commerce-api-v2.academlo.tech/api/v1/purchases', {}, getConfig())
        .then(() => {
            getPurchasesThunk()(dispatch);//Colocamos los items en la lista de comprados.
            dispatch(setCart(getCartThunk()(dispatch)));//El carrito es vaceado en la DDBB, pero el que tiene la app aún contiene los items, hay que llamar nuevamente el carrito para vacearlo.
        })
        .catch(err => console.log(err))
        .finally(() => dispatch(setLoading(false)));
}

export const { setPurchases } = purchases.actions;

export default purchases.reducer;
