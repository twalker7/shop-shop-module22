import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';

//imported for refactor to support global state object 22.1.6
import { useStoreContext } from "../utils/GlobalState";
import { UPDATE_PRODUCTS } from "../utils/actions";



import Cart from '../components/Cart';

//additional imports for 22.6 functionality -- merge at will
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
} from '../utils/actions';

import {idbPromise} from "../utils/helpers"



function Detail() {
  const [state, dispatch] = useStoreContext();
const { id } = useParams();

const [currentProduct, setCurrentProduct] = useState({})

const { loading, data } = useQuery(QUERY_PRODUCTS);

//cart variable was added to destructuring 
const { products, cart } = state;


/* useEffect(() => {
  if (products.length) {
    setCurrentProduct(products.find(product => product._id === id));
  } else if (data) {
    dispatch({
      type: UPDATE_PRODUCTS,
      products: data.products
    });
  }
}, [products, data, dispatch, id]);
*/
// added from 22.3.4
useEffect(() => {
  // already in global store
  if (products.length) {
    setCurrentProduct(products.find(product => product._id === id));
  } 
  // retrieved from server
  else if (data) {
    dispatch({
      type: UPDATE_PRODUCTS,
      products: data.products
    });

    data.products.forEach((product) => {
      idbPromise('products', 'put', product);
    });
  }
  // get cache from idb
  else if (!loading) {
    idbPromise('products', 'get').then((indexedProducts) => {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: indexedProducts
      });
    });
  }
}, [products, data, loading, dispatch, id]);

/* 22.2.6 add-to-cart functionality addtoCart()
const addToCart = () => {
  dispatch({
    type: ADD_TO_CART,
    product: { ...currentProduct, purchaseQuantity: 1 }
  });
};

*/

//22.2.7 add-to-cart functionality 
const addToCart = () => {
  const itemInCart = cart.find((cartItem) => cartItem._id === id)

  if (itemInCart) {
    dispatch({
      type: UPDATE_CART_QUANTITY,
      _id: id,
      purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
    });
    // if we're updating quantity, use existing item data and increment purchaseQuantity value by one
    idbPromise('cart', 'put', {
      ...itemInCart,
      purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
    });
  } else {
    dispatch({
      type: ADD_TO_CART,
      product: { ...currentProduct, purchaseQuantity: 1 }
    });
    // if product isn't in the cart yet, add it to the current shopping cart in IndexedDB
    idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
  }
}

//22.2.7
const removeFromCart = () => {
  dispatch({
    type: REMOVE_FROM_CART,
    _id: currentProduct._id
  });
};
  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button 
  disabled={!cart.find(p => p._id === currentProduct._id)} 
  onClick={removeFromCart}
>
  Remove from Cart
</button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
    <Cart/>
    </>
  );
}

export default Detail;
