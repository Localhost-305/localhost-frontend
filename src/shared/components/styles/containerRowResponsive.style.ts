import styled from 'styled-components';

interface ContainerRowResponsiveProps {
    maxWidth: string;
  }

export const ContainerRowResponsive = styled.div<ContainerRowResponsiveProps>`
    display: flex;
    gap: 1em;
    flex-wrap: wrap; 

    @media (max-width: ${(props) => props.maxWidth}) {
        flex-direction: column;
        width: 100%; 
    }

    @media (max-width: 1200px) {
        width: 100%; 
        margin: 0px;
    }

    @media (max-width: 768px) {
        width: 100%; 
        margin: 0px;
    }
}`;