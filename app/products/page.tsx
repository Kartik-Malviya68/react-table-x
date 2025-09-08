import getProductList from '@/fetch/getProductList/getProductListService'
import React from 'react'
import ProductsTable from './Components/ProductsTable/ProductsTable'
export default async function page() {
    const products = await getProductList()
    return (
        <div className='p-4 mt-8 container  mx-auto'><ProductsTable products={products} /></div>
    )
}
