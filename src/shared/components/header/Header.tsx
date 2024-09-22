import { useState } from 'react';
import { DownOutlined, UserOutlined} from '@ant-design/icons';
import { Dropdown, Modal, Avatar, Button } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import Menu  from "../menu/Menu"
import { logout } from "../../functions/connection/auth";
import { HeaderContainer, MenuContainer, ContainerLogoName } from "./Header.style"
import { getItemStorage } from "../../functions/connection/storageProxy";
import { NAME } from "../../constants/authorizationConstants";


const Header = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const allName = `${getItemStorage(NAME)}`;
    const userPhoto = '';

    const items: MenuProps['items'] = [
        // {
        //     key: '1',
        //     label: (
        //         <a target="_blank" rel="noopener noreferrer" href="#">
        //             Perfil
        //         </a>
        //     ),
        // }
        {
            key: '3',
            label: 'Sair',
            danger: true,
            onClick: showModal,
        },
    ];

    return (
        <>
            <Modal
                title="Atenção"
                open={open}
                onOk={() => logout(navigate)}
                onCancel={hideModal}
                okText="Sim"
                cancelText="Cancelar"
            >
                <p>Tem certeza que deseja sair?</p>
            </Modal>

            <HeaderContainer>
            <ContainerLogoName>
            <img src="logo-sem-fundo.png" alt="Logo" style={{ height: '70px',  marginLeft: '10px', marginRight: '10px' }} />
            <MenuContainer style={{ width: '100%' }}>
                <Menu />
            </MenuContainer>
            </ContainerLogoName>
                <Dropdown menu={{ items }}>
                    <Button type="link" 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        margin: '0px 15px 0px 0px', 
                        height: '45px', 
                        backgroundColor: 'var(--orange)',
                        color: 'var(--white)',
                        fontWeight: 500
                    }}>
                        <Avatar
                            src={userPhoto || undefined}
                            icon={!userPhoto && <UserOutlined />}
                            style={{ marginRight: 8 }}
                        />
                        {allName} <DownOutlined />
                    </Button>
                </Dropdown>
            </HeaderContainer>
        </>
    );
};

export default Header;
