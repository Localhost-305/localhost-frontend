import { Table } from 'antd';
import styled from 'styled-components';

export const ResponsiveTable = styled(Table)`
  width: 100%; 

  @media (min-width: 1201px) {
    width: 50%; 
  }

  @media (max-width: 1200px) {
    width: 80%; 
  }

  @media (max-width: 768px) {
    width: 100%; 
  }
`;