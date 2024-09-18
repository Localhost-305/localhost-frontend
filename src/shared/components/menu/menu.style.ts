import { Typography , Menu as MenuAntd } from "antd";
import styled from "styled-components";

const { Text } = Typography;

export const ContainerMenu = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 240px;
    background-color: var(--light);
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

export const StyledMenu = styled(MenuAntd)`
    background-color: var(--light);
    border-right: none; /* Remover borda direita padrão do Ant Design */

    .ant-menu-item {
        color: var(--black); /* Cor do texto do item */
    }

    .ant-menu-item:hover {
        background-color: var(--orange); /* Cor de fundo no hover */
        color: var(--white); /* Cor do texto no hover */
    }

    .ant-menu-item-selected {
        background-color: var(--orange) !important; /* Cor de fundo do item selecionado */
        color: var(--white); /* Cor do texto do item selecionado */
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