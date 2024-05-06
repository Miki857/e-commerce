import React, { useEffect, useRef, useState } from 'react';
import "./css/searchInputs.css";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentProducts } from '../store/slices/currentProducts';
import axios, { all } from 'axios';
import RenderProducts from './RenderProducts';
import { setLoading } from '../store/slices/loading.slice';

const SearchInputs = () => {
  //VARIABLES GLOBALES:---------------------------------------------------------------------------------------------
  const dispatch = useDispatch();
  const currentProducts = useSelector(store => store.currentProducts);
  const currentCategories = useSelector(store => store.currentCategories);
  const currentBrands = useSelector(store => store.currentBrands);
  const allProducts = useSelector(store => store.allProducts);

  //ANIMACION PARA LA APARICION DEL MENU FILTER:---------------------------------------------------------------------------------------------
  const menuFilter = useRef();//Referencia al DOM Element.
  const menuFilter__bg = useRef();//Referencia al DOM Element.
  const menuFilter__content = useRef();//Referencia al DOM Element.
  const openFilter = () =>  {
    menuFilter.current.classList.remove("hiddenTransition");
    setTimeout(() => menuFilter__bg.current.classList.remove("hiddenOpacity"), 300);
    setTimeout(() => menuFilter__content.current.classList.remove("hiddenTransition"), 300);
  }
  const closeFilter = () =>  {//Aca es al reves.
    menuFilter__content.current.classList.add("hiddenTransition");
    setTimeout(() => menuFilter__bg.current.classList.add("hiddenOpacity"), 300);
    setTimeout(() => menuFilter.current.classList.add("hiddenTransition"), 500);
  }

  //EVENTO PARA ABRIR Y CERRAR LA SECCION DE FILTRADO-PRECIOS, CATEGORIAS y BRANDS EN EL MENU FILTER:---------------------------------------------------------------------------------------------
  const slideMenu_Price = useRef();
  const slideCategory = useRef();
  const slideBrand = useRef();
  const slideMenu = (element) => {
    element.current.classList.toggle("Closed");
  };

  //TRAEMOS LAS CATEGORIAS DE LA VARIABLE GLOBAL Y LOS INSERTAMOS EN LA LISTA:---------------------------------------------------------------------------------------------
  const listaCategorias = useRef();
  useEffect(() => {
    //Primero hay que eliminar las <li> existentes:
    for(const _li of document.querySelectorAll("#listaCategorias li")){
      _li.remove();
    }

    //Ahora creamos las nuevas y las agregamos:
    currentCategories.map(category => {
      const li = document.createElement("li");//Creamos el <li>
      li.setAttribute("class", "cursor-pointer");
      li.innerText = category;//Le colocamos el texto con la categoria a mostrar.
      li.addEventListener("click", () => {
        //Cada que hagamos click en alguna categoria, actualizaremos currentProdutcs(Variable que almacena los productos a mostrar).
        dispatch(setCurrentProducts(currentProducts.filter(product => product.category.name == li.innerText)));

        //Reseteamos la lista de Brands y Category:
        resetBrandsCategoryUL();
        //Loading Screen:
        dispatch(setLoading(true));
      });
  
      //Lo agregamos al <ul>:
      listaCategorias.current.appendChild(li);
    });
  
  }, [currentCategories]);

  //AHORA CREAMOS LA LISTA CON LAS MARCAS:---------------------------------------------------------------------------------------------
  const listaBrands = useRef();
  useEffect(() => {
    //Primero hay que eliminar las <li> existentes:
    for(const _li of document.querySelectorAll("#listaBrands li")){
      _li.remove();
    }

    //Ahora creamos las nuevas y las agregamos:
    currentBrands.map(brand => {
      const li = document.createElement("li");//Creamos el <li>
      li.setAttribute("class", "cursor-pointer");
      li.innerText = brand;//Le colocamos el texto con la categoria a mostrar.
      li.addEventListener("click", () => {
        //Cada que hagamos click en alguna marca, actualizaremos currentProdutcs(Variable que almacena los productos a mostrar).
        dispatch(setCurrentProducts(currentProducts.filter(product => product.brand == li.innerText)));
        //Reseteamos la lista de Brands y Category:
        resetBrandsCategoryUL();
        //Loading Screen:
        dispatch(setLoading(true));
      });
  
      //Lo agregamos al <ul>:
      listaBrands.current.appendChild(li);
    });
  
  }, [currentBrands]);

  //FILTRADO POR PRECIO:-----------------------------------------------------------------------------------------------------
  const fromInput = useRef();
  const toInput = useRef();
  const handlePriceSearchFilter = (event) => {
    event.preventDefault();

    if(toInput.current.value > fromInput.current.value){
      //Filtramos:
      const filteredProducts = currentProducts.filter(product => product.price >= +fromInput.current.value && product.price <= +toInput.current.value);
      //Actualizamos:
      dispatch(setCurrentProducts(filteredProducts));
      //Reseteamos la lista de Brands y Category:
      resetBrandsCategoryUL();
      //Loading Screen:
      dispatch(setLoading(true));
    }else{
      console.log("datos mal ingresados");
    }
  };

  //QUITAMOS LOADING SCREEN:
  useEffect(() => {
    //Loading Screen:
    dispatch(setLoading(false));
  }, [currentProducts])

  //SEARCH-INPUT---------------------------------------------------------------------------------------------------------------
  const searchInput = useRef();
  const handleSearchInput = (event) => {
    event.preventDefault();
    axios.get("https://e-commerce-api-v2.academlo.tech/api/v1/products?title=" + searchInput.current.value)
      .then(res => {dispatch(setCurrentProducts(res.data)); resetBrandsCategoryUL();})
      .catch(err => console.log(err));
  };

  //FUNCIONES---------------------------------------------------------------------------------------------------------------
  function resetBrandsCategoryUL(){
    //ATENCION: Si cambias 'currentProduct', tambien hay que actualizar la lista de CATEGORIAS. Por lo tanto hay que eliminar los <li> dentro del <ul> que contiene las categorias para que en el useEffect se recalculen..
    for(const li of document.querySelectorAll("#listaCategorias li")){
      li.remove();
    }
    //Lo mismo con Marcas:
    for(const li of document.querySelectorAll("#listaBrands li")){
      li.remove();
    }
  }

  //REMOVE HIDE BEHAVIOR ON FILTER-MENU ON DESKTOP:------------------------------------------------------------------
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  //Obtengo los datos iniciales de la Ventana:
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {width, height};
  }

  //Le agregamos un Listener a la Ventana:
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);//FUNCION DE 'LIMPIEZA'(https://legacy.reactjs.org/docs/hooks-effect.html#example-using-hooks-1);
  }, []);

  //Ahora agregamos funcionalidad al FILTER-MENU:
  if(windowDimensions.width >= 1000){
    menuFilter.current?.classList.remove("hiddenTransition");
    setTimeout(() => menuFilter__bg.current?.classList.remove("hiddenOpacity"), 300);
    setTimeout(() => menuFilter__content.current?.classList.remove("hiddenTransition"), 300);
  }else{
    menuFilter__content.current?.classList.add("hiddenTransition");
    setTimeout(() => menuFilter__bg.current?.classList.add("hiddenOpacity"), 300);
    setTimeout(() => menuFilter.current?.classList.add("hiddenTransition"), 500); 
  }
  

  return (
    <section className='searchInputs__section flex flex-column gap-01'>
        <form className='searchInputs__form'>
          <input type="text" ref={searchInput} placeholder='Iphone 13 Pro Max...' required />
          <button className='searchBTN cursor-pointer' onClick={handleSearchInput}><i className='bx bx-search bx-sm'></i></button>
        </form>

        <button onClick={openFilter} className='filterBTN flex align-center cursor-pointer'><i className='bx bx-filter bx-sm'></i> Filter</button>
        
        {/* Menu de filtrado que por defecto esta oculto*/}
        <div className='menuFilter hiddenTransition' ref={menuFilter}>
          <div className='menuFilter__bg hiddenOpacity' ref={menuFilter__bg}>
            <div className='menuFilter__content flex flex-column gap-01 hiddenTransition' ref={menuFilter__content}>
              <i className='closeBTN bx bx-x bx-lg cursor-pointer' onClick={closeFilter}></i>

              <h2>Filters</h2>

              {/* PRECIO */}
              <div className='slideMenu_Price flex flex-column gap-01' ref={slideMenu_Price}>
                <h3 className='cursor-pointer' onClick={() => slideMenu(slideMenu_Price)}>Price</h3>

                <form className='flex flex-column gap-01' onSubmit={handlePriceSearchFilter}>
                  <div className='container'>
                    <label htmlFor="fromInput">From</label>
                    <input className='input' type="number" id='fromInput' ref={fromInput} min="0" max="10000" placeholder='$50.00' required/>
                  </div>
                  <div className='container'>
                    <label htmlFor="toInput">To</label>
                    <input className='input' type="number" id='toInput' ref={toInput} min="100" max="10000" placeholder='$200.00' required/>
                  </div>
                  <button className='button cursor-pointer'>Filter</button>
                </form>

              </div>

              {/* CATEGORIA */}
              <div className='slideCategory flex flex-column gap-01' ref={slideCategory}>
                <h3 className='cursor-pointer' onClick={() => slideMenu(slideCategory)}>Category</h3>
                
                <ul className='flex flex-column gap-01' id='listaCategorias' ref={listaCategorias}>
                </ul>
              </div>

              {/* MARCAS */}
              <div className='slideBrand flex flex-column gap-01' ref={slideBrand}>
                <h3 className='cursor-pointer' onClick={() => slideMenu(slideBrand)}>Brands</h3>
                
                <ul className='flex flex-column gap-01' id='listaBrands' ref={listaBrands}>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RENDER PRODUCTS(only on desktop) */}
        <div className='desktopRenderProducts'>
         <RenderProducts/>
        </div>
    </section>
  );
}

export default SearchInputs;