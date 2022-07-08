import { FC, useState } from 'react';
import styled from 'styled-components';
import { Typography, Form, Input, Button, message } from 'antd';
import { ILoginProps } from '../data/useDatabase';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Item } = Form;
const { Password } = Input;

const Login: FC<ILoginProps> = ({ login }) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = ({ username, password }: any) => {
    setLoading(true);
    login(username, password)
      .catch(e => { message.error(e.statusCode === 401 ? "Salah Nama atau Password." : `${e.errorCode}: ${e.error}`) })
      .finally(() => setLoading(false));
  };

	return (
		<Container>
      <div>
        <Title level={5} style={{ textAlign: 'right' }}>Handal Cargo</Title>
        <Title level={2}>Log In</Title>
        <Form onFinish={onSubmit}>
          <Item name="username" rules={[{ required: true, message: 'Nama Pengguna harus diisi.' }]}>
            <Input prefix={<UserOutlined style={{ color: 'gray' }} />} placeholder="Nama Pengguna" />
          </Item>
          <Item name="password" rules={[{ required: true, message: 'Kata Sandi harus diisi.' }]}>
            <Password prefix={<LockOutlined style={{ color: 'gray' }} />} placeholder="Kata Sandi" />
          </Item>
          <Button type="primary" loading={loading} htmlType="submit">Masuk</Button>
        </Form>
        <Text>© Handal Cargo 2022, All rights reserved.</Text>
      </div>
    </Container>
	);
}

export default Login;

const Container = styled.div`
  background-image: url('/login.jpg');
  background-size: cover;
  background-position: right;
  display: flex;
  justify-content: right;
  height: 100vh;

  > div {
    background-color: #fff;
    width: 52%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 45px 40px;
    position: relative;

    > h2 {
      margin-bottom: 20px;
    }

    > h5 {
      position: absolute;
      top: 12px;
      right: 20px;
    }

    > span:last-of-type {
      position: absolute;
      bottom: 12px;
      left: 40px;
      font-size: 10px;
    }
  }
`;
