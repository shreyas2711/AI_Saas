import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Dropdown, Layout, Menu, Space, theme } from 'antd';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { useAuth } from "./AuthProvider";
const { Header, Content, Footer, Sider } = Layout;


// const items1 = ['1', '2', '3'].map((key) => ({
//   key,
//   label: `nav ${key}`,
// }));
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});




const LayoutDesign = () => {
  const auth = useAuth();
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const items1 = [
    // {key:'login',label:token?'Logout':'Login'},
    // { key: 'upgrade', label: 'Upgrade' },
    // { key: 'userdashboard', label: 'Dashboard' },
  ]
  const items3 = [
    { key: 'removeObjects', label: 'Remove Objects' },
    { key: 'sharpenImage', label: 'Sharpen Objects' },
    { key: 'imageFolder', label: 'Image Folder' },
   
    { key: '', label: 'Home' },
  ];

  const handleNavigateNavbar=({key})=>{
    navigate(`/${key}`)
  }
  const handleLogout = ()=>{
    auth.logOut();
  }
  
  const handleNavigateSidebar = ({key})=>{
    navigate(`/${key}`)
  }
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleDropdownRoute=()=>{
    navigate('/userDetail/userDashboard');
  }

  const items = [
    {
      key: '1',
      label: (
        <span onClick={handleDropdownRoute}>
        My Profile  
       </span>
      ),
    },
    {
      key: '2',
      danger: true,
      label:
      <span onClick={handleLogout}>
      Logout
     </span>
    },
  ];

  

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" style={{marginLeft:'95rem'}}  />
      
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          onClick={handleNavigateNavbar}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
        <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
      <Person2OutlinedIcon color='primary'/>
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
      </Header>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{
            padding: '24px 0',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['removeObjects']} 
              onClick={handleNavigateSidebar}
              style={{
                height: '80vh',
              }}
              items={items3}
            />
          </Sider>
          <Content
            style={{
              padding: '0 24px',
              minHeight: 280,
            }}
          >
             <Outlet />
          </Content>
        </Layout>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};
export default LayoutDesign;













