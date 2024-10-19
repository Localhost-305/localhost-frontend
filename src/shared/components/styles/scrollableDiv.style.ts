import styled from 'styled-components';

export const ScrollableDiv = styled.div`
  width: 100%;  
  min-width: 500px; 
  overflow-x: auto; 

  @media only screen and (max-width: 768px) {
    min-width: 320px; 
  }
`;