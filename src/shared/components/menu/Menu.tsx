import type { MenuProps } from 'antd';

import { StyledMenu } from './menu.style';

const Menu = () => {
<<<<<<< HEAD
  const items: MenuProps['items'] = [
=======
  const [current, setCurrent] = useState('Home');
  const items: MenuProps['items'] = [ 
>>>>>>> be692483424da41e4137d8956c2f4943ea55cda3
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
