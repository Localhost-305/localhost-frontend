import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu as MenuAntd } from 'antd';
import type { MenuProps } from 'antd';
import { HomeOutlined,
        UserOutlined } from '@ant-design/icons';
        
import styles from "./Menu.module.css";
import NumCalculator from 'antd/es/theme/util/calc/NumCalculator';
import logo from '../../../../public/logo-sem-fundo.png';
import { ContainerLogoName, ContainerMenu, StyledMenu } from './menu.style';
import { useWindowSize } from '../../hooks/useWindowSize';


type MenuItem = Required<MenuProps>['items'][number];

const Menu = () => {
    const [current, setCurrent] = useState('1');
    const navigate = useNavigate(); 
    const [collapsed, setCollapsed] = useState(false);
    const {width} = useWindowSize();

    useEffect(() => {
      if(Number(width) <= 768){
        setCollapsed(true);
      }else{
        setCollapsed(false);
      }
    }, [width]);

    const items: MenuItem[] = [
        {
          key: 'Home',
          icon: <HomeOutlined />,
          label: 'Aprovações',
        },
        { 
          key: 'users_key',
          icon: <UserOutlined />, 
          label: 'Usuários',
          children: [
              { key: 'user_consult', label: 'Consultar', onClick: () => null}, // use this to navigate => navigate(UserRoutesEnum.USER)
              { key: 'user_insert', label: 'Cadastrar', onClick: () => NumCalculator},
          ], 
        }
    ];
  
    const onClick: MenuProps['onClick'] = (e) => {
      setCurrent(e.key);
    };

    return (
        <ContainerMenu>
            <ContainerLogoName>
                <img src={logo} style={{width: '190px', height: '80px', margin: '0px 16px', objectFit: 'contain'}}/>
                {/* <NameCompany>Company</NameCompany> */}
            </ContainerLogoName>
            <StyledMenu onClick={onClick}
                className={styles.custom_menu}
                selectedKeys={[current]}
                mode="vertical"
                inlineCollapsed={collapsed}
                items={items}/>
        </ContainerMenu>
    );
}

export default Menu;