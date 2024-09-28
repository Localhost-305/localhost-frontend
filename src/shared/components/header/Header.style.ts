import styled from "styled-components";
import { LogoutOutlined } from "@ant-design/icons";

export const HeaderContainer = styled.header`
    height: 72px;
    width: 100%;
    padding: 0 20px;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 16px;
    background-color: var(--orange);
    -webkit-box-shadow: 0px 1px 8px 0px rgba(0,0,0,0.47);
    -moz-box-shadow: 0px 1px 8px 0px rgba(0,0,0,0.47);
    box-shadow: 0px 1px 8px 0px rgba(0,0,0,0.47);
`;

export const MenuContainer = styled.div`
  background-color: var(--orange);
`;

export const ContainerLogoName = styled.div`
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        height: 60px;
    }
`;

export const LogoExit = styled(LogoutOutlined)`
    font-size: 24px;
`;  