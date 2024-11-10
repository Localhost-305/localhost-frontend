import { Table } from 'antd';
import styled from 'styled-components';

export const UserTable = styled(Table)`
  width: 100%; 
  margin-top: 20px;

  td.ant-table-cell {
    font-size: 16px; 
  }

  th.ant-table-cell {
    font-size: 16px; 
  }

  @media (min-width: 1201px) {
    width: 80%; 
  }

  @media (max-width: 1200px) {
    width: 80%; 
  }

  @media (max-width: 768px) {
    width: 100%; 
  }
`;