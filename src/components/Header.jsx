import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { createUserHunk, loginUserHunk, setUser } from '../store/slices/user.slice';
import CartCard from './CartCard';
import { setSumaTotal } from '../store/slices/currentSumaTotalCart.slice';
import { addToCartThunk, getCartThunk, modifyQuantityThunk, setCart } from '../store/slices/cart.slice';
import { setCartProducts } from '../store/slices/currentCartProducts.slice';

import "./css/header.css"
import { getPurchasesThunk, purchaseCartThunk, setPurchases } from '../store/slices/purchase.slice';
import { useNavigate } from 'react-router-dom';
import { setCurrentProducts } from '../store/slices/currentProducts';
import { setLoading } from '../store/slices/loading.slice';

const Header = () => {
  //GLOBAL VARIABLES:---------------------------------------------------------------------------------------------------
  const currentCartProducts = useSelector(store => store.currentCartProducts);
  const currentSumaTotalCart = useSelector(store => store.currentSumaTotalCart);
  const user = useSelector(store => store.user);
  const cart = useSelector(store => store.cart);
  const allProducts = useSelector(store => store.allProducts);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //REACT-HOOK-FORM:---------------------------------------------------------------------------------------------------------
  const {handleSubmit, register, reset} = useForm();
  const submit = (data) => {
    if(status == "login"){
      //INICIAR SESION:----------------------------------------------------------
      dispatch(setUser(loginUserHunk("https://e-commerce-api-v2.academlo.tech/api/v1/users/login")(data, dispatch)));
      //Reseteamos los valores del Form:
      reset({
        email: "",
        password: ""
      });
    }else{
      //REGISTRARSE:--------------------------------------------------------------
      dispatch(setUser(createUserHunk("https://e-commerce-api-v2.academlo.tech/api/v1/users")(data, dispatch)));
      reset({//Este es un metodo que ya viene incluido en 'useForm', se usa para resetear, blanquear, o dar valores distintos a los input del 'form', por ahora solo los vamos a blanquear.
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: ""
      });
    }
    //LOADING SCREEN:----------------------------------------------------------
    dispatch(setLoading(true));
  };

  useEffect(() => {
    if(user != null){
      //Obtenemos el carrito del DDBB:
      dispatch(setCart(getCartThunk()(dispatch)));
      //Obtenemos los purchases:
      dispatch(setPurchases(getPurchasesThunk()(dispatch)))
    }
  },[user]);

  //Agregamos los items de 'currentCartProducts' al carrito del DDBB:-----------
  useEffect(() => {
    if(cart){
      //Al iniciar session 'cart' pasa de 'null' a [];
      currentCartProducts.map(_currentProduct => {
        console.log(2)
        let bool = false;// Nos servira para saber si el item deve actualizarse o agregarse enteramente.
        cart.map(_product => {
          console.log("_product:" + _product, "id:" + _product.id)
          console.log("_currentProduct:" + _currentProduct, "quantity:" + _currentProduct.quantity)
          if(_currentProduct.id == _product.product.id){//Si el 'id' del alguno de los items de 'currentCartProducts' es igual a alguno de los de la DDBB:
            //Actualizamos quantity:Nuevo valor = quantityDelCarritoDDBB + quantityCarritoLocal
            dispatch(setCart(modifyQuantityThunk(_product.id, {"quantity": (_product.quantity + _currentProduct.quantity)})(dispatch)));
            bool = true;
          }
        });
        if(!bool){
          //Sino entonces es un item nuevo y lo agregamos al carrito:
          dispatch(setCart(addToCartThunk({"quantity": _currentProduct.quantity, "productId": _currentProduct.productId})(dispatch)));
        }
      })
      //Al pasar los items de 'currentCartProducts', lo tenemos que vacear:
      dispatch(setCartProducts([]));
    }
  }, [cart]);

  // console.log("cart:",cart);
  // console.log("currentCartProducts:", currentCartProducts);
  // console.log("user:", user);
  // console.log("localStorage_userName:", localStorage.getItem("userName"));
  // console.log("localStorage_token:", localStorage.getItem("token"));
  // console.log("purchases:", purchases);

  //LOG OUT:------------------------------------------------------------------------
  const logOut = () => {
    localStorage.setItem("userName", "");
    dispatch(setUser(null));
    dispatch(setCart(null));
    dispatch(setPurchases([]));
  };

  //DOM:------------------------------------------------------------------------------------------------------------------------------
  const title = useRef();
  const anchorRegister = useRef();
  const formBTN = useRef();

  const [status, setStatus] = useState("login");//Para diferenciar las acciones del formulario(iniciar session o registrarse).
  useEffect(() => {
    if(title.current != undefined && anchorRegister.current != undefined && formBTN.current != undefined){
      if(status == "login"){
        title.current.innerText = "Login";
        formBTN.current.innerText = "Login";
        anchorRegister.current.innerText = "Create account";
      }else{
        title.current.innerText = "Register";
        formBTN.current.innerText = "Register";
        anchorRegister.current.innerText = "←Back";
      }
    }
  },[status, title]);

  //OPEN USER-FORM ANIMATION---------------------------------------------------------------------------------------------
  const userForm__container = useRef();
  const openUserForm = (status) => {
    status == "open" ? userForm__container.current.classList.remove("hiddenScale") : userForm__container.current.classList.add("hiddenScale");
  };

  //OPEN USER-CART ANIMATION---------------------------------------------------------------------------------------------
  const userCart__container = useRef();
  const openUserCart = (status) => {
    status == "open" ? userCart__container.current.classList.remove("hiddenScale") : userCart__container.current.classList.add("hiddenScale");
  };

  //SUMA TOTAL DEL CARRITO:-----------------------------------------------------------------------------------------------------------
  useEffect(() => {
    let suma = 0;
    if(cart != null){
      //Sumamos el carrito de la DDBB:
      for(const item of cart){//Iteramos por cada item en el carrito => item = {quantity, product, id};
        suma += +item.product.price * item.quantity;
      }
    }else{
      console.log(currentCartProducts);
      //Sumamos el carrito local:
      for(const item of currentCartProducts){//Iteramos por cada item en el carrito => item = {quantity, product, id};
        suma += +item.product.price * item.quantity;
      }
    }
    dispatch(setSumaTotal(suma));//Actualizamos suma total.
  }, [currentCartProducts, cart]);

  console.log(cart)

  //CHECKOUT:------------------------------------------------------------------------------------------------------
  const checkout = () => {
    if(user){
      //Comprar:
      dispatch(setLoading(true));
      dispatch(setPurchases(purchaseCartThunk()(dispatch)));
    }else{
      console.log("inicia sesion primero.")
    }
  }
  return (
    <header className='header flex justify-between align-center'>
        <h2 className='logo cursor-pointer' onClick={() => {navigate("/"); dispatch(setCurrentProducts(allProducts));}}>e-commerce</h2>
        <div className="foo flex gap-02">
            <i title='Login' className='bx bxs-user bx-sm cursor-pointer' onClick={() => openUserForm("open")}></i>{/* ICONO USUARIO */}
            <i title='Items Purchased' className='bx bxs-package bx-sm cursor-pointer' onClick={() => navigate("/purchases")}></i>{/* ICONO PURCHASES */}
            <i title='Cart' className='bx bxs-cart-alt bx-sm cursor-pointer' onClick={() => openUserCart("open")}></i>{/* ICONO CARRITO */}
        </div>

        {/* USER FORM */}
        <div className='userForm__container hiddenScale flex justify-center align-center' ref={userForm__container}>
          {
            user!= null ?
              //Cuando el usuario este logeado hay que mostrar su perfil con el boton de 'Log-Out':
              <div className='profile basicShadow'>
                <i className='bx bx-x bx-lg cursor-pointer' onClick={() => openUserForm("close")}></i>
                <strong>{user?.user.firstName + " " + user?.user.lastName}</strong>
                <p>{user?.user.email}</p>
                <a className='cursor-pointer' onClick={() => logOut()}>Log Out</a>
              </div>
            :
            //Cuando el usuario NO este logeado:
            <form onSubmit={handleSubmit(submit)} className='userForm flex flex-column gap-02 basicShadow' autoComplete='off'>
                {/* FORM HEADER */}
              <div className='formHeader'>
                <h2 className='title' ref={title}>Login</h2>
                <i title='close' className='closeBTN-X bx bx-x bx-lg bx-tada-hover cursor-pointer' onClick={() => openUserForm("close")}></i>
              </div>
              {
                status == "login" ?
                  <>
                    {/* Login Inputs */}
                    <div className='flex flex-column gap-00_5'>
                      <input {...register('email')} type="text" placeholder='Email' id='inputEmailLogin' required/>
                    </div>
                    <div className='flex flex-column gap-00_5'>
                      <input {...register('password')} type="password" placeholder='Password' id='inputPasswordLogin' autoComplete='off' required/>
                    </div>
                  </>
                :
                  <>
                    {/* REGISTER INPUTS */}
                    <div className='flex flex-column gap-01'>
                      <div className='flex flex-column'>
                        <label htmlFor="inputFirstname">First Name</label>
                        <input {...register('firstName')} type="text" id='inputFirstname' required/>
                      </div>
                      <div className='flex flex-column'>
                        <label htmlFor="inputLastName">Last Name</label>
                        <input {...register('lastName')}  type="text" id='inputLastName' required/>
                      </div>
                      <div className='flex flex-column'>
                        <label htmlFor="inputPassword">Password</label>
                        <input {...register('password')}  type="password" id='inputPassword' required/>
                      </div>
                      <div className='flex flex-column'>
                        <label htmlFor="inputEmail">Email</label>
                        <input {...register('email')}  type="email" id='inputEmail' required/>
                      </div>
                      <div className='flex flex-column'>
                        <label htmlFor="inputPhone">Phone</label>
                        <input {...register('phone')}  type="tel" id='inputPhone' required/>
                      </div>
                    </div>
                  </>
              }
              <div className='flex flex-column gap-01'>
                <button className='button cursor-pointer' ref={formBTN}>Login</button>
                <a className='cursor-pointer' onClick={() => (status == "login") ? setStatus("register") : setStatus("login")}ref={anchorRegister}>Create account</a>
              </div>
            </form>

          }
          
        </div>

        {/* CART */}
        <div className='userCart__container hiddenScale flex justify-center align-center' ref={userCart__container}>
            <div className='cart flex flex-column gap-02'>
              <div className='flex justify-between align-center'>
                <h2>Cart</h2>
                <i title='Close' className='closeBTN-X bx bx-x bx-lg bx-tada-hover cursor-pointer' onClick={() => openUserCart("close")}></i>
              </div>
              <div className='cart_items flex flex-column'>
                {
                  user != null ?
                    cart?.length > 0 ?
                      <>
                        {
                          cart.map((cartProduct, index) => <CartCard key={index} image={cartProduct.product.images[0].url} product={cartProduct.product.title} quantity={cartProduct.quantity} id={cartProduct.productId} ddbbId={cartProduct.id} price={cartProduct.product.price}/>)
                        }
                      </>
                    :
                      <p>No Products</p>
                  :
                    currentCartProducts?.length > 0 ?
                      <>
                        {
                          currentCartProducts.map((cartProduct, index) => <CartCard key={index} image={cartProduct.product.images[0].url} product={cartProduct.product.title} quantity={cartProduct.quantity} id={cartProduct.productId} price={cartProduct.product.price}/>)
                        }
                      </>
                    :
                      <p>No Products</p>
                }
              </div>
              <button className='checkoutBTN cursor-pointer' onClick={() => checkout()}>Checkout <strong>${currentSumaTotalCart}</strong></button>
            </div>
        </div>
    </header>
  )
}

export default Header