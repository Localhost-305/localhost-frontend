import type { MenuProps } from 'antd';

import { StyledMenu } from './menu.style';

const Menu = () => {
  const items: MenuProps['items'] = [
    {
      label: 'Home',
      key: 'Home',
    },
    {
      label: 'Usuários',
      key: 'Users',
    },
  ];

  return (
    <StyledMenu
      mode="horizontal"
      items={items as MenuProps['items']}
    />
  );

};

export default Menu;
