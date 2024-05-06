import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { setCategories } from '../store/slices/currentCategories';
import { setBrands } from '../store/slices/currentBrands';
import { setCurrentProducts } from '../store/slices/currentProducts';

const RenderProducts = () => {
    const dispatch = useDispatch();
    const allProducts = useSelector(store => store.allProducts);
    const currentProducts = useSelector(store => store.currentProducts);
    //PRIMERO RECIBIMOS LOS PRODUCTOS:
    //ACTUALIZAMOS currentProducts al aterrizar en la pagina:
    useEffect(() => {
        //Esto es un principio, cuando se aterriza en la pagina, currentProducts = allProducts.
        dispatch(setCurrentProducts(allProducts));
    }, [allProducts]);

    //Calculamos las categorias disponibles:(ATENCION: ESTO A BASE DE LOS PRODUCTOS QUE SE ESTAN VIENDO)
    useEffect(() => {
        const _categories = [];//Contendra las categorias repitiendose.
        currentProducts.map(_product => _categories.push(_product.category.name));//Se las agregamos.
        const set = new Set(_categories);//Reducimos
        dispatch(setCategories(Array.from(set)));//Agregamos al estado.
    },[currentProducts]);

    //Ahora las Brands:
    useEffect(() => {
        const _brands = [];//Contendra las marcas repitiendose.
        currentProducts.map(_product => _brands.push(_product.brand));//Se las agregamos.
        const set = new Set(_brands);//Reducimos
        dispatch(setBrands(Array.from(set)));//Agregamos al estado.
    },[currentProducts]);

    return (
        <section className='renderProducts__section flex justify-center flex-wrap gap-02'>
            {
                currentProducts.length > 0 ?
                    currentProducts?.map(product => <ProductCard key={product.id} product={product}/>)
                :
                    <div className='flex flex-column align-center gap-01'>
                        <p>{"No results :("}</p>
                        <p className='cursor-pointer' onClick={() => dispatch(setCurrentProducts(allProducts))}>Home</p>
                    </div>
            }
        </section>
    );
}

export default RenderProducts;