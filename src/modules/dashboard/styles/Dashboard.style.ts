import styled from 'styled-components';
import { Card } from 'antd';

export const StyledCard = styled(Card)`
  position: relative;
  overflow: hidden;
  background-color: var(--white);
  color: var(--black);
  border-radius: 28px;
  transition: transform 0.5s ease;
  border: 1px solid var(--yellow);
  margin-top: 20px;
  width: 330px; 
  height: 200px; 

  &:hover {
    transform: scale(1.05);
    .card-bg {
      transform: scale(10);
    }
    .card-title,
    .card-date,
    .card-date span {
      color: white; 
    }
  }

  .card-bg {
    position: absolute;
    top: -75px;
    right: -75px;
    width: 128px;
    height: 128px;
    background-color: var(--yellow);
    border-radius: 50%;
    border-color: var(--yellow);
    transition: all 0.5s ease;
    z-index: 0; 
  }

  .card-title {
    font-weight: bold;
    font-size: 30px;
    color: var(--black);
    z-index: 1; 
    position: relative; 
  }

  .card-date {
    font-size: 26px;
    color: var(--black);
    z-index: 1; 
    position: relative; 
  }

  .card-date span {
    font-weight: bold;
    color: #f9b234;
    transition: color 0.5s ease;
  }

  &:hover .card-date span {
    color: white;
  }
`;
