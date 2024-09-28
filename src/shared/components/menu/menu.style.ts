import { Typography , Menu as MenuAntd } from "antd";
import styled from "styled-components";
import { Menu as AntMenu } from 'antd';

const { Text } = Typography;

export const ContainerMenu = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 240px;
    background-color: var(--orange);
    -webkit-box-shadow: 1px 0px 8px 0px rgba(0,0,0,0.71);
    -moz-box-shadow: 1px 0px 8px 0px rgba(0,0,0,0.71);
    box-shadow: 1px 0px 8px 0px rgba(0,0,0,0.71);

    @media (max-width: 768px) {
        width: 100px; /* Reduz a largura em telas menores */
    }
`;

export const StyledMenu = styled(AntMenu)`
    background-color: var(--orange);
    color: var(--white);
    border: none; 

    .ant-menu-item {
        color: var(--white); 
    }

    @media (max-width: 768px) {
        .ant-menu-item {
            font-size: 12px; /* Ajustar o tamanho do texto para telas menores */
        }
    }
`;

export const NameCompany = styled(Text)`
    color: black;
`;