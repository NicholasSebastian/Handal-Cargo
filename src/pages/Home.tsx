import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Card, Statistic } from "antd";
import useDatabase from "../data/useDatabase";

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const Home: FC = () => {
  const database = useDatabase();
  const [data, setData] = useState<IData>();

  useEffect(() => {
    // Fetch all invoices printed this month.
    database?.collection('Invoices')
      .find({ 
        print_date: { 
          $gte: new Date(currentYear, currentMonth, 1), 
          $lte: new Date(currentYear, currentMonth + 1, 0) 
        } 
      }, { 
        projection: { _id: 0, total: 1, payment: 1 } 
      })
      .then(results => {
        const invoicesTotal = results.reduce((acc, result) => acc + result.total, 0);

        // Fetch all payments involved in those invoices.
        database.collection('Payments')
          .find({ _id: { $in: results.map(result => result.payment) } })
          .then(results => results.reduce((acc, result) => {
            const paymentTotal = result.items.reduce((acc: number, item: any) => acc + item.amount, 0);
            return acc + paymentTotal;
          }, 0))
          .then(paymentsTotal => setData({ invoicesTotal, paymentsTotal }));
      });
  }, []);

  return (
    <Container>
      <Card>
        <Statistic
          title="Total Faktur Bulan Ini"
          value={data?.invoicesTotal}
          prefix="Rp." />
      </Card>
      <Card>
        <Statistic
          title="Total Pembayaran Untuk Bulan Ini"
          value={data?.paymentsTotal}
          prefix="Rp."
          valueStyle={data ? { color: (data.invoicesTotal <= data.paymentsTotal) ? '#3f8600' : '#cf1322' } : undefined} />
      </Card>
    </Container>
  );
}

export default Home;

const Container = styled.div`
  margin: 20px;
  display: flex;

  > div {
    width: 280px;
    border-radius: 5px;
    margin-right: 20px;
  }
`;

interface IData {
  invoicesTotal: number
  paymentsTotal: number
}
