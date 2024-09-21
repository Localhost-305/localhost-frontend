import React, { useState } from 'react';
import { AppstoreOutlined, HomeOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu as AntMenu } from 'antd';

const Menu = () => {
const [current, setCurrent] = useState('Home');
const items: MenuProps['items'] = [
  {
    label: 'Home',
    key: 'Home',
    icon: <HomeOutlined />,
  },
  {
    label: 'Dashboard',
    key: 'Dashboard',
  },
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <AntMenu
    onClick={onClick} 
      selectedKeys={[current]} 
      mode="horizontal" 
      items={items as MenuProps['items']}
      />
  );

};

export default Menu;