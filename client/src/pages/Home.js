import React, { useState } from "react";
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";

// import from 22.2.4
import Cart from '../components/Cart';



const Home = () => {
  return (
    <div className="container">
  <CategoryMenu />
  <ProductList />
  <Cart />
  </div>
  );
};
/*  code we removed after refactoring --useState removed from dependency
const Home = () => {
  const [currentCategory, setCategory] = useState("");

  return (
    <div className="container">
      <CategoryMenu setCategory={setCategory} />
      <ProductList currentCategory={currentCategory} />
    </div>
  );
};
*/ 


export default Home;
