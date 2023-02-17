import { FC } from "react";
import styled from "styled-components";
import { List } from "antd";

const { Item } = List;
const { Meta } = Item;

const Reports: FC = () => {
  return (
    <Container>
      <List
        dataSource={[
          { 
            title: 'Laporan Rugi Laba Sea Freight',
            description: 'Shipping ➔ Sea Freight ➔ View ➔ Laporan Rugi Laba' 
          },
          { 
            title: 'Surat Jalan Sea Freight',
            description: (
              <div>
                <div>Shipping ➔ Sea Freight ➔ View ➔ Buat Surat Jalan ➔ Print Surat Jalan</div>
                <div>Shipping ➔ Sea Freight ➔ Surat Jalan ➔ View ➔ Print Ulang Surat Jalan</div>
              </div>
            )
          },
          { 
            title: 'Surat Jalan Daerah Sea Freight',
            description: (
              <div>
                <div>Shipping ➔ Sea Freight ➔ View ➔ Buat Surat Jalan ➔ Print Surat Jalan Daerah</div>
                <div>Shipping ➔ Sea Freight ➔ Surat Jalan ➔ View ➔ Print Ulang Surat Jalan Daerah</div>
              </div>
            )
          },
          { 
            title: 'Faktur Sea Freight',
            description: (
              <div>
                <div>Shipping ➔ Sea Freight ➔ View ➔ Buat Faktur ➔ Print Faktur</div>
                <div>Shipping ➔ Sea Freight ➔ Faktur ➔ View ➔ Print Ulang Faktur</div>
              </div>
            )
          },
          { 
            title: 'Laporan Rugi Laba Air Cargo',
            description: 'Shipping ➔ Air Cargo ➔ View ➔ Laporan Rugi Laba' 
          },
          { 
            title: 'Surat Jalan Air Cargo',
            description: (
              <div>
                <div>Shipping ➔ Air Cargo ➔ View ➔ Buat Surat Jalan ➔ Print Surat Jalan</div>
                <div>Shipping ➔ Air Cargo ➔ Surat Jalan ➔ View ➔ Print Ulang Surat Jalan</div>
              </div>
            ) 
          },
          { 
            title: 'Surat Jalan Daerah Air Cargo',
            description: (
              <div>
                <div>Shipping ➔ Air Cargo ➔ View ➔ Buat Surat Jalan ➔ Print Surat Jalan Daerah</div>
                <div>Shipping ➔ Air Cargo ➔ Surat Jalan ➔ View ➔ Print Ulang Surat Jalan Daerah</div>
              </div>
            )
          },
          { 
            title: 'Faktur Daerah Air Cargo',
            description: (
              <div>
                <div>Shipping ➔ Air Cargo ➔ View ➔ Buat Faktur ➔ Print Faktur</div>
                <div>Shipping ➔ Air Cargo ➔ Faktur ➔ View ➔ Print Ulang Faktur</div>
              </div>
            ) 
          }
        ]}
        renderItem={entry => (
          <Item>
            <Meta
              title={entry.title}
              description={entry.description} />
          </Item>
        )} />
    </Container>
  );
}

export default Reports;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 10px 20px;
`;
