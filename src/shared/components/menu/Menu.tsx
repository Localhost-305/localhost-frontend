import { useState } from 'react';
import { MenuClickEventHandler } from 'antd/lib/menu'; // Tipo correto do evento
import { StyledMenu } from './menu.style';

const Menu = () => {
  const [current, setCurrent] = useState('Home');

  const items = [
    {
      label: 'Dashboard',
      key: 'Dashboard',
    },
  ];

  // Usando o tipo correto para o evento de clique do menu
  const onClick: MenuClickEventHandler = (e) => {
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
