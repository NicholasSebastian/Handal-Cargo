import { FC } from "react";
import ListTemplate from "../../components/ListTemplate";

const ProductDetails: FC = () => {
  return (
    <ListTemplate 
      collectionName="ProductDetails"
      nameLabel="Keterangan Barang" />
  );
}

export default ProductDetails;
