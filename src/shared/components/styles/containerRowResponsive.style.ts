import styled from 'styled-components';

interface ContainerRowResponsiveProps {
    maxWidth: string;
  }

export const ContainerRowResponsive = styled.div<ContainerRowResponsiveProps>`
    display: flex;
    gap: 1em;

    @media (max-width: ${(props) => props.maxWidth}) {
        flex-direction: column;
    }
    @media (max-width: 1200px) {
        width: calc(100% - 282px);
        margin: 0px;
    }
    @media (max-width: 768px) {
        width: calc(100% - 142px);
        margin: 0px;
    }
`;