import { Table } from 'antd';
import styled from 'styled-components';

export const ResponsiveTable = styled(Table)`
  width: 100%; 
  margin-top: 20px;

  @media (min-width: 1201px) {
    width: 35%; 
  }

  @media (max-width: 1200px) {
    width: 80%; 
  }

  @media (max-width: 768px) {
    width: 100%; 
  }
`;