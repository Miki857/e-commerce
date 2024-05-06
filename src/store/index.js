import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user.slice";
import allProducts from "./slices/allProducts.slice";
import allCategories from "./slices/allCategories";
    
import currentBrands from "./slices/currentBrands";
import currentCategories from "./slices/currentCategories";
import currentProducts from "./slices/currentProducts";
import currentCartProducts from "./slices/currentCartProducts.slice";
import currentSumaTotalCart from "./slices/currentSumaTotalCart.slice";
import cart from "./slices/cart.slice";
import purchases from "./slices/purchase.slice";
import loading from "./slices/loading.slice";

const store = configureStore({
    reducer: {
        user,
        cart,
        allProducts,
        allCategories,
        currentBrands,
        currentCategories,
        currentProducts,
        currentCartProducts,
        currentSumaTotalCart,
        purchases,
        loading

    }
});

export default store;