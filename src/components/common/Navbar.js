import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import smallLogo from '../../images/small-logo.png';

import ClientContext from '../../state/client/clientContext';

const { Header } = Layout;

function Navbar(props) {
  const clientContext = useContext(ClientContext);
  const {
    authState,
    authService,
    getClient,
    client,
    setAccountType,
  } = clientContext;
  const [clientEmail, setClientEmail] = useState();

  const history = useHistory();

  useEffect(() => {
    if (authState.isAuthenticated && authState.idToken) {
      authService.getUser().then(res => {
        setClientEmail(res.email);
      });
    } else if (authState.isAuthenticated && !authState.idToken) {
      authService.logout();
    }
  }, [authState]);

  useEffect(() => {
    if (clientEmail) {
      const userEmail = { email: `${clientEmail}` };
      getClient(userEmail);
    }
  }, [clientEmail]);

  useEffect(() => {
    if (Object.keys(client).length > 0) {
      setAccountType();
    }
  }, [client]);

  return (
    <Header
      style={{
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #D3D3D3',
      }}
    >
      <Menu mode="horizontal">
        <Menu.Item key="1" onClick={() => history.push('/')}>
          <img src={smallLogo} alt="small-logo" />
        </Menu.Item>
        {Object.keys(client).length < 1 ? (
          <Menu.Item key="2">Express Groomer</Menu.Item>
        ) : (
          <Menu.Item key="2">{`Welcome, ${client.name}`}</Menu.Item>
        )}
      </Menu>
      {authState.isAuthenticated ? (
        <Menu mode="horizontal">
          <Menu.Item key="3" onClick={() => history.push('/')}>
            Home
          </Menu.Item>
          <Menu.Item key="4" onClick={() => history.push('/client-dash')}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="5" onClick={() => authService.logout()}>
            Log out
          </Menu.Item>
        </Menu>
      ) : (
        <Menu mode="horizontal">
          <Menu.Item key="3" onClick={() => history.push('/')}>
            Home
          </Menu.Item>
          <Menu.Item key="4" onClick={() => history.push('/login')}>
            Log in
          </Menu.Item>
        </Menu>
      )}
    </Header>
  );
}

export default Navbar;
