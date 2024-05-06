import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCartProducts } from "../store/slices/currentCartProducts.slice";
import { addToCartThunk, setCart } from '../store/slices/cart.slice';

import "./css/productCard.css"
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../store/slices/loading.slice';

const ProductCard = ({product}) => {
  //GLOBAL VARIABLES:---------------------------------------------------------------------------------------------
  const currentCartProducts = useSelector(store => store.currentCartProducts);
  const inputProductQuantity = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //ADD TO LOCAL CART:--------------------------------------------------------------------------------------------
  const addProductToCart = () => {
    event.preventDefault();
    if(localStorage.getItem("userName") != ""){
      //ATENCION: Cuando el usuario este logeado, vamos a jugar directamente con el carrito de la DDBB:
      console.log({"quantity": +inputProductQuantity.current.value, "productId": product.id})
      dispatch(setCart(addToCartThunk({"quantity": +inputProductQuantity.current.value, "productId": product.id})(dispatch)));
    }else{
      //ATENCION: Cuando el usuario NO este logeado, vamos a jugar directamente con el carrito local:
      let replaceCart = false;//Para saber si agregamos el producto actual al carrito o si vamos a crear un nuevo carrito y reemplazarlo todo.
      const copyCurrentCartProducts = Array.from(currentCartProducts);
  
      Array.from(currentCartProducts).map(_product => {
        //Los indices o propiedades en un ESTADO son READONLY, no los podemos modificar.
        //1.Cuando el producto ya exista en el carrito, lo que haremos sera crear un nuevo item de carrito con las propiedades del que ya existen pero modificando su 'quantity'. Ya que al ser READONLY no lo podemos modificar directamente.
        //2.Luego crearemos un nuevo carrito pero reemplazando el producto que se repite por el nuevo creado.
        if(_product.productId == product.id){
          //Creamos el nuevo producto con 'quantity' modificado:
          const modifiedProduct = {//1.
            "quantity": _product.quantity + +inputProductQuantity.current.value,
            "product": _product.product,
            "productId": _product.productId
          };
          //Crear un nuevo arreglo que reemplazara al actual:
          const newCart = [];//2.
          Array.from(currentCartProducts).map(_product2 => {
            if(_product2.productId == product.id){//SIgnifica que este es el producto a reemplazar:
              newCart.push(modifiedProduct);
            }else{//Sino colocamos los otros productos sin reemplazar:
              newCart.push(_product2);
            }
          });
          //Actualizamos variable global:
          dispatch(setCartProducts(newCart));
          replaceCart = true;
        }
      });
      if(!replaceCart){
        dispatch(setCartProducts([...copyCurrentCartProducts, {"quantity": +inputProductQuantity.current.value,"product": product,"productId": product.id}]));
      }
    }
  };

  //ADD HOVER TO CHANGE IMG:
  const productIMG = useRef();
  const changeImg = (value) => {
    if(value == "in"){
      productIMG.current.src = product?.images[1].url;
    }else{
      productIMG.current.src = product?.images[0].url;
    }
  };

  return (
    <div className='productCard basicShadow' onMouseEnter={() => changeImg("in")} onMouseLeave={() => changeImg("out")}>
        {/* IMAGE */}
        <img onClick={() => {dispatch(setLoading(true)); navigate("/product/"+product.id);}} className='cursor-pointer' src={product?.images[0].url} alt="Product IMG" ref={productIMG}/>
        {/* PRICE */}
        <div className='productDescription flex flex-column justify-between'>
          <h2>${product?.price}</h2>
          {/* TITLE */}
          <div className='title flex flex-column gap-00_5'>
              <h4>{product.brand}</h4>
              <h3>{product?.title}</h3>
          </div>
          <div className='productDescription__inner flex flex-column gap-01'>
              {/* ADD TO CAR */}
              <form onSubmit={addProductToCart}>
                <div className='container'>
                  <i className='height-fitContent bx bx-chevron-left bx-sm arrowBTN cursor-pointer flex align-center' onClick={ () => {if(+inputProductQuantity.current.value - 1 > 0){inputProductQuantity.current.value = +inputProductQuantity.current.value - 1}}} ></i>
                  <input type="number" defaultValue="1" min="1" max="100" ref={inputProductQuantity} required/>
                  <i className='height-fitContent bx bx-chevron-right bx-sm arrowBTN cursor-pointer flex align-center' onClick={() => {if(+inputProductQuantity.current.value + 1 < 100){inputProductQuantity.current.value = +inputProductQuantity.current.value + 1}}}></i>
                </div>
                <button className='addBTN cursor-pointer'>Add</button>
              </form>
          </div>
        </div>
    </div>
  )
};

export default ProductCard;