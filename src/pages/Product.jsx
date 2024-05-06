import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./css/product.css";
import ProductCard from '../components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { setCartProducts } from '../store/slices/currentCartProducts.slice';
import { addToCartThunk, setCart } from '../store/slices/cart.slice';
import { setLoading } from '../store/slices/loading.slice';

const Product = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState();
    const [similarProducts, setSimilarProducts] = useState();
    const inputProductQuantity = useRef();
    const currentCartProducts = useSelector(store => store.currentCartProducts);
    const dispatch = useDispatch();

    console.log(product);
    console.log(similarProducts);
    console.log(params);

    useEffect(() => {
        //Obtenemos los datos del producto:
        axios.get("https://e-commerce-api-v2.academlo.tech/api/v1/products/" + params.id)
            .then(res => setProduct(res.data))
            .catch(err => console.log(err));
    },[params]);

    useEffect(() => {
        if(product){
            //Obtenemos productos similares:
            axios.get("https://e-commerce-api-v2.academlo.tech/api/v1/products?categoryId=" + product.category.id)
                .then(res => setSimilarProducts(res.data))
                .catch(err => console.log(err))
                .finally(dispatch(setLoading(false)));
        }
    },[product, params]);
    
    //SLIDE GALLERY ANIMATION:
    const gallerySlider = useRef();
    const turnPage = (value) => {
        console.log(gallerySlider.current.style.transform)
        if(value == 1){
            //Deslizar a la derecha:
            switch(gallerySlider.current.style.transform){
                case "":
                    gallerySlider.current.style = "transform: TranslateX(-33.3333%)";
                    break;
                case "translateX(-33.3333%)":
                    gallerySlider.current.style = "transform: TranslateX(-66.6666%)";
                    break;
            }
        }else{
            //Deslizar a la izquierda:
            switch(gallerySlider.current.style.transform){
                case "translateX(-66.6666%)":
                    gallerySlider.current.style = "transform: TranslateX(-33.3333%)";
                    break;
                case "translateX(-33.3333%)":
                    gallerySlider.current.style = "";
                    break;
            }
        }
        console.log(gallerySlider.current.style.transform)
    };

    //ADD TO LOCAL CART:--------------------------------------------------------------------------------------------
    const addProductToCart = () => {
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

    return (
        <div className='product flex flex-column gap-01'>
            {/* ROOT */}
            <div className='flex gap-00_5'>
                <strong className='cursor-pointer' onClick={() => {dispatch(setLoading(true)); navigate("/");}}>Home</strong>
                <strong>/</strong>
                <i>{product?.title}</i>
            </div>

            <div className='imageInfo__container'>
                {/* IMAGE */}
                <div className='flex align-center'>
                    <i className='height-fitContent bx bx-chevron-left bx-sm arrowBTN cursor-pointer flex align-center' onClick={() => turnPage(-1)}></i>
                    <div className='gallery'>
                        <ul className='gallerySlider flex align-items' ref={gallerySlider}>
                            <li className='flex justify-center align-center'><img src={product?.images[0].url} alt="Product IMG" /></li>
                            <li className='flex justify-center align-center'><img src={product?.images[1].url} alt="Product IMG" /></li>
                            <li className='flex justify-center align-center'><img src={product?.images[2].url} alt="Product IMG" /></li>
                        </ul>
                    </div>
                    <i className='height-fitContent bx bx-chevron-right bx-sm arrowBTN cursor-pointer flex align-center' onClick={() => turnPage(1)}></i>
                </div>
                
                {/* INFORMATION */}
                <div className='flex flex-column gap-02'>
                    <div className='flex flex-column gap-00_5'>
                        <h4>{product?.brand}</h4>
                        <h3>{product?.title}</h3>
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex flex-column gap-00_5'>
                            <h4>Price</h4>
                            <h3>${product?.price}</h3>
                        </div>
                        <div className='flex flex-column gap-00_5'>
                            <h4>Quantity</h4>
                            <div className='flex align-center'>
                                <i className='height-fitContent bx bx-chevron-left bx-sm arrowBTN cursor-pointer flex align-center'
                                    onClick={ () => {if(+inputProductQuantity.current.value - 1 > 0){inputProductQuantity.current.value = +inputProductQuantity.current.value - 1;}}} ></i>
                                <input className='input' type="number" defaultValue="1" min="1" max="100" ref={inputProductQuantity} required/>
                                <i className='height-fitContent bx bx-chevron-right bx-sm arrowBTN cursor-pointer flex align-center'
                                    onClick={() => {if(+inputProductQuantity.current.value + 1 < 100){inputProductQuantity.current.value = +inputProductQuantity.current.value + 1;}}}></i>
                            </div>
                        </div>
                    </div>
                    <button className='button cursor-pointer' onClick={() => addProductToCart()}>Add to cart</button>
                    {/* Description */}
                    <p>{product?.description}</p>
                </div>
            </div>

            {/* Similar Items */}
            <div className='similarItems'>
                <h3>Discover similar items</h3>
                <div className='list flex justify-center flex-wrap gap-02'>
                    {
                        similarProducts?.length > 0 ?
                            similarProducts?.map(_product => {if(product.id != _product.id) return <ProductCard key={_product.id} product={_product}/>})
                        :
                            "No hay productos similares :("
                    }
                </div>
            </div>
        </div>
    )
}

export default Product