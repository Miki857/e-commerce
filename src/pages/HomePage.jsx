import React from 'react';
import SearchInputs from '../components/SearchInputs';
import RenderProducts from '../components/RenderProducts';
import "./css/homePage.css";

const homePage = () => {
  return (
    <section className='main'>
      <SearchInputs/>

      <div className='mobileRenderProducts'>
        <RenderProducts/>
      </div>
    </section>
  )
}

export default homePage