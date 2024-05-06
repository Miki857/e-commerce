import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../store/slices/loading.slice';

const PurchaseCard = ({purchase}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fechaOriginal = new Date(purchase.createdAt);
  const dia = fechaOriginal.getDate();
  const mes = fechaOriginal.getMonth() + 1;
  const año = fechaOriginal.getFullYear();

  const fechaTransformada = `${año}-${mes}-${dia}`;

  return (
    <div className='purchaseCard'>
        <p className='fecha'><i>{fechaTransformada}</i></p>
        <img src={purchase.product.images[0].url} alt="Purchased IMG" onClick={() => {dispatch(setLoading(true)); navigate("/product/"+purchase.product.id);}}/>
        <div className='container'>
            <p>{purchase.product.title}</p>
            <p><span>Quantity: </span>{purchase.quantity}</p>
            <p><span>Price: </span>${purchase.product.price}.00</p>
        </div>
    </div>
  );
}

export default PurchaseCard;