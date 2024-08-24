import { Typography } from "antd";
import styled from "styled-components";

const { Text } = Typography;

export const ContainerMenu = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 240px;
    background-color: var(--beige);
    -webkit-box-shadow: 1px 0px 8px 0px rgba(0,0,0,0.71);
    -moz-box-shadow: 1px 0px 8px 0px rgba(0,0,0,0.71);
    box-shadow: 1px 0px 8px 0px rgba(0,0,0,0.71);

    @media (max-width: 768px) {
        width: 100px; /* Reduz a largura em telas menores */
    }
`;

export const ContainerLogoName = styled.div`
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;

    -webkit-box-shadow: -2px 6px 4px 0px rgba(0,0,0,0.47);
    -moz-box-shadow: -2px 6px 4px 0px rgba(0,0,0,0.47);
    box-shadow: -2px 6px 4px 0px rgba(0,0,0,0.47);

    @media (max-width: 768px) {
        height: 60px;
    }
`;

export const NameCompany = styled(Text)`
    color: black;
`;