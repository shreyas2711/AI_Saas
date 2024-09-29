import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Dropdown, Layout, Menu, Space, theme } from 'antd';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import { useAuth } from "./AuthProvider";
import { DownOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const UserLevelLayout = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const items1 = [
    { key: '', label: 'Home' },
    // { key: 'userDashboard', label: 'Dashboard' }, // Ensure this matches the route path
  ];

  const items3 = [
    { key: 'userDashboard', label: 'Dashboard' }, // Ensure this matches the route path
    { key: 'upgrade', label: 'Upgrade' },
    { key: 'sharpenImage', label: 'My orders' },
  ];

  const handleNavigateNavbar = ({ key }) => {
    navigate(`/removeObjects`); // Navigating under `/userDetail` for dashboard
  };

  const handleNavigateSidebar = ({ key }) => {
    navigate(`/userDetail/${key}`); // Navigating under `/userDetail`
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    auth.logOut();
  };

  const items = [
    {
      key: '1',
      label: 'My Profile',
    },
    {
      key: '2',
      danger: true,
      label: <span onClick={handleLogout}>Logout</span>,
    },
  ];

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" style={{ marginLeft: '95rem' }} />
        <Menu theme="dark" mode="horizontal" items={items1} onClick={handleNavigateNavbar} style={{ flex: 1, minWidth: 0 }} />
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Person2OutlinedIcon color='primary' />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Layout style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Sider style={{ background: colorBgContainer }} width={200}>
            <Menu mode="inline" defaultSelectedKeys={['userDashboard']} onClick={handleNavigateSidebar} style={{ height: '80vh' }} items={items3} />
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: '75vh' }}>
            <Outlet />
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
    </Layout>
  );
};

export default UserLevelLayout;
