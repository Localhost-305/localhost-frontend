import { useState } from 'react';
import type { MenuProps } from 'antd';

import { StyledMenu } from './menu.style';

const Menu = () => {
  const [current, setCurrent] = useState('Home');
  const items: MenuProps['items'] = [
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
    <StyledMenu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items as MenuProps['items']}
    />
  );

};

export default Menu;