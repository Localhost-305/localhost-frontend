import Navbar from "react-bootstrap/esm/Navbar";
import styled from "styled-components";

// Container geral do Header
export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 30px;
    background-color: var(--gray-dark);
    box-shadow: 1px 0px 8px 0px rgba(0, 0, 0, 0.71);
`;

// Adaptação do estilo de logo e menu
export const ContainerLogoName = styled.div`
    display: flex;
    align-items: center;
`;

// Container de menu adaptado para o header
export const MenuContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

export const StyledMenu = styled(Navbar)`
    background-color: var(--gray-dark);
    color: var(--white);
    border: none;
    width: 100%;
    .nav-link {
        color: var(--white);
    }
    
    .nav-link:hover {
        color: var(--orange);
    }
`;

export const NameCompany = styled.div`
    color: white;
    font-size: 16px;
    margin-left: 10px;
`;
