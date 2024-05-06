import React from 'react'
import PurchaseCard from '../components/PurchaseCard'
import "../components/css/purchases.css"

const Purchases = ({purchases}) => {
    console.log(purchases)
    return (
      <section className='purchases__section flex flex-column align-center gap-01_5'>
          {
              purchases?.map((_purchase, index) => <PurchaseCard key={index} purchase={_purchase}/>)
          }
      </section>
    )
}

export default Purchases