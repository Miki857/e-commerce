import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getAllProductHunk, getAllProducts } from "./store/slices/allProducts.slice";
import Header from "./components/Header";
import { getAllCategories, getAllCategoriesHunk } from "./store/slices/allCategories";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import Purchases from "./pages/Purchases";
import Product from "./pages/Product";

import "./normalize.css"
import "./attributes.css"


function App() {
  //REDUX:
  const user = useSelector(store => store.user);
  const purchases = useSelector(store => store.purchases);
  const dispatch = useDispatch();

  useEffect(() => {//ESTE SOLO SE EJECUTA 1 VEZ:------------------------------------------------------------
    //Obtenemos los productos mediante un REDUX HUNK:
    dispatch(getAllProducts(getAllProductHunk("https://e-commerce-api-v2.academlo.tech/api/v1/products")(dispatch)));
    //Obtenemos las categorias mediante un REDUX HUNK:
    dispatch(getAllCategories(getAllCategoriesHunk("https://e-commerce-api-v2.academlo.tech/api/v1/categories")(dispatch)));
    //Establecemos en el localStorage el token:
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTIyLCJmaXJzdE5hbWUiOiJhbmRyZXMiLCJsYXN0TmFtZSI6Ik1lbmRvemEiLCJlbWFpbCI6ImFuZHJlc0BnbWFpbC5jb20iLCJwaG9uZSI6IjEyMzQ1Njc4OTAiLCJjcmVhdGVkQXQiOiIyMDIzLTAyLTAxVDAzOjE0OjQ4LjI5NVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTAyLTAxVDAzOjE0OjQ4LjI5NVoifSwiaWF0IjoxNjc1MzYxODkwfQ.ZRIVLai2-aAqHln27EuGnnaW-waLWi-kPUwwW-lB0Bs");
    localStorage.setItem("userName", "");
  }, []);

  //LOADING:------------------------------------------------------------------------------------------------
  const loading = useSelector(store => store.loading);
  const loadingScreen = useRef();
  useEffect(() => {
    if(loading){
      loadingScreen.current.classList.remove("hiddenOpacity");
      setTimeout(() => {
        loadingScreen.current.style = "display: flex";
      }, 300);
    }else{
      loadingScreen.current.classList.add("hiddenOpacity");
      setTimeout(() => {
        loadingScreen.current.style = "display: none";
      }, 300);
    }
  }, [loading]);

  return (
    <>
      {/* LOADING */}
      <div className="loadingScreen flex align-center justify-center" ref={loadingScreen}>
        <i className='bx bx-loader-circle bx-spin bx-lg' ></i>
      </div>

      {/* CODE */}
      <Header/>
      <Routes>
        <Route element={<ProtectedRoutes user={user}/>}>
          <Route path="/purchases" element={<Purchases purchases={purchases}/>}/>
        </Route>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/product/:id" element={<Product/>}/>
        <Route path="*" element={<p>La pagina no existe...</p>}/>
      </Routes>
    </>
  )
}

export default App
