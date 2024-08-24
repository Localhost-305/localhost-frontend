import styled from 'styled-components';

export const ButtonStyled = styled.button<{ color?: 'beige' | 'blue' | 'green' }>`
  font-size: 19px;
  margin-top: 1em;
  width: 100%;
  max-width: 250px;
  height: 40px;
  border: 0px;
  border-radius: 5px;
  color: var(--black);
  background-color: ${({ color }) => {
    switch (color) {
      case 'beige':
        return 'var(--beige)';
      case 'green':
        return 'var(--green)';
      default:
        return 'var(--blue)';
    }
  }};
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(2px);
  }

  &.button_black {
    color: var(--black);
    background-color: var(--beige);
  }
`;
