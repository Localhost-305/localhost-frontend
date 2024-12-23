import { useState } from 'react';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Modal, Avatar, Button } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, Link } from 'react-router-dom'; 
import { logout } from "../../functions/connection/auth";
import { HeaderContainer, MenuContainer, ContainerLogoName, StyledMenu } from "../menu/menu.style";
import { getItemStorage } from "../../functions/connection/storageProxy";
import { NAME } from "../../constants/authorizationConstants";
import { DashboardRoutesEnum } from '../../../modules/dashboard/routes';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserRoutesEnum } from '../../../modules/user/routes';

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
                </ContainerLogoName>

                <StyledMenu>
                    <Container>
                        <Nav className="me-auto">
                        <Nav.Link as={Link} to={DashboardRoutesEnum.DASHBOARD}> Home </Nav.Link>
                        <Nav.Link as={Link} to={UserRoutesEnum.USER}> Usuários </Nav.Link>
                        </Nav>
                    </Container>
                </StyledMenu>

                <Dropdown menu={{ items }}>
                    <Button type="link" 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        margin: '0px 30px 0px 0px', 
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
