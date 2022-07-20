import { FC } from "react";
import ListTemplate from "../../components/ListTemplate";

const ProductDetails: FC = () => {
  return (
    <ListTemplate 
      collectionName="ProductDetails"
      form={{ nameLabel: "Keterangan Barang" }} />
  );
}

export default ProductDetails;
