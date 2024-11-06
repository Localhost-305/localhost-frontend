import { useState } from 'react';
import { MenuProps } from 'antd';
import { StyledMenu } from './menu.style';

const Menu = () => {
  const [current, setCurrent] = useState('Home');

  const items: MenuProps['items'] = [
    {
      label: 'Dashboard',
      key: 'Dashboard',
    },
  ];

  // Tipo correto para o evento de clique do menu
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key); // Aqui você usa 'e.key' corretamente
  };

  return (
    <StyledMenu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Menu;
