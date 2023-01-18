import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const ProductDetails: FC = () => {
  return (
    <ListTemplate 
      collectionName="ProductDetails"
      searchBy="name"
      form={[
        { key: 'name', label: 'Keterangan Barang' }
      ]} />
  );
}

export default ProductDetails;
