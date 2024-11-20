import styled from 'styled-components';

export const ContainerRowResponsive = styled.div`
    display: flex;
    gap: 1em;
    flex-wrap: wrap; 

    @media (max-width: 800px) {
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