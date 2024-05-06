import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCartProducts } from '../store/slices/currentCartProducts.slice';
import { deleteFromCartThunk, modifyQuantityThunk, setCart } from '../store/slices/cart.slice';

import "./css/cartCard.css";

const CartCard = ({image, product, quantity, id, ddbbId, price}) => {
  //VARIABLES GLOBALES:----------------------------------------------------------------------------------------------------------------
  const currentCartProducts = useSelector(store => store.currentCartProducts);
  const dispatch = useDispatch();

  //AUMENTAR EL QUANTITY:--------------------------------------------------------------------------------------------------------------
  const changeQuantity = (value) => {
    if(localStorage.getItem("userName") != ""){
      //ATENCION: Cuando el usuario este logeado, vamos a jugar directamente con el carrito de la DDBB:
      if(quantity + value >= 1){
        dispatch(setCart(modifyQuantityThunk(ddbbId, {"quantity": quantity + value})(dispatch)))
      }
    }else{
      //ATENCION: Cuando el usuario NO este logeado, vamos a jugar directamente con el carrito local:
      const newCartItems = [];//Como no podemos modificar las propiedades de la variable global, lo que haremos sera crear una nueva lista con el quantity ya actualizado del producto.
      currentCartProducts.map((_product) => {
        console.log(_product.productId)
        console.log(id)
        if(_product.productId == id && _product.quantity + value >= 1){//Identificamos el producto que se va a modificar su 'quantity':
          const newProduct = {"quantity": _product.quantity + value, "product": _product.product, "productId": _product.productId};//Este tendra el quantity modificado.
          newCartItems.push(newProduct);
        }else{
          newCartItems.push(_product);
        }
      });
      //Ahora actualizamos el carrito:
      dispatch(setCartProducts(newCartItems));
    }
  }

  //BORRAR ITEM:------------------------------------------------------------------------------------------------------------------------
  const deleteItem = () => {
    if(localStorage.getItem("userName") != ""){
      //ATENCION: Cuando el usuario este logeado, vamos a jugar directamente con el carrito de la DDBB:
      dispatch(setCart(deleteFromCartThunk(ddbbId)(dispatch)));
    }else{
      //ATENCION: Cuando el usuario NO este logeado, vamos a jugar directamente con el carrito local:
      const newCartItems = [];//Como no podemos modificar las propiedades de la variable global, lo que haremos sera crear una nueva lista con el quantity ya actualizado del producto.
      currentCartProducts.map((_product) => {
        //Simplemente no vamos a agregar el producto con el id a borrar:
        if(_product.productId != id){//Identificamos el producto que se va a borrar:
          newCartItems.push(_product);
        }
      });
      //Ahora actualizamos el carrito:
      dispatch(setCartProducts(newCartItems));
    }
  }

  return (
    <div className='cartCard flex flex-wrap justify-center align-center gap-01'>
      <img src={image} alt="Product IMG" width={"60"}/>
      <b className='price flex justify-center align-center'>${price}.00</b>
      <div className='flex flex-column gap-01'>
        <p>{product}</p>
        <div className='flex justify-between align-center'>
          <div className='flex align-center gap-01'>
            <button className='arrowBTN cursor-pointer' onClick={() => changeQuantity(-1)}>-</button>
            <span>{quantity}</span>
            <button className='arrowBTN cursor-pointer' onClick={() => changeQuantity(1)}>+</button>
          </div>
          <button className='button cursor-pointer' onClick={() => deleteItem()}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default CartCard;