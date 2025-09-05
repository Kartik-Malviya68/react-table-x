export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: Review[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: {
        createdAt: string; // ISO date string
        updatedAt: string; // ISO date string
        barcode: string;
        qrCode: string;
    };
    images: string[];
    thumbnail: string;
}

export interface Review {
    rating: number;
    comment: string;
    date: string; // ISO date string
    reviewerName: string;
    reviewerEmail: string;
}



export interface ProductList {
    products: Product[],
    total: number,
    skip: number,
    limit: number
}


export default async function getProductList() {
    try {
        const res = await fetch('https://dummyjson.com/products', {
            credentials: 'include',
        })

        return res.json() as Promise<ProductList>
    } catch (error) {
        return Promise.resolve({ products: [], total: 0, skip: 0, limit: 0 })
    }
}
