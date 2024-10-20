import styled from 'styled-components';

interface LimitedContainerProps {
    width: number;
    margin?: string;
}

export const LimitedContainer = styled.div<LimitedContainerProps>`
    width: ${(props) => props.width}px;
    ${(props) => props.margin ? `margin: ${props.margin}` : ''}

@media (max-width: 390px) {
    width: 100%; 
    h2, small {
        word-wrap: break-word; 
        }
    }
`;