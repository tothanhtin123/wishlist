import { Product } from "@/types/product";
import React from "react";
import ProductItem from "./product-item";

type ProductListProps = {
  products: Product[];
  onItemEditClick: (id: string) => void;
  onItemDeleteClick: (id: string) => void;
};

const ProductList: React.FC<ProductListProps> = (props) => {
  if (props.products.length <= 0) {
    return (
      <div className="flex justify-center items-center py-10 h-[400px]">
        <h1 className="text-center text-2xl">Empty</h1>
      </div>
    );
  }
  return (
    <ul className="flex flex-col md:flex-row items-center flex-wrap gap-y-6">
      {props.products.map((item: Product) => {
        return (
          <ProductItem
            onEditClick={props.onItemEditClick}
            onDeleteClick={props.onItemDeleteClick}
            key={`product-${item.id}`}
            {...item}
          />
        );
      })}
    </ul>
  );
};

export default ProductList;
