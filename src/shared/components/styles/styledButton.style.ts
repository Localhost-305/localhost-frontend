import { Button } from "antd";
import styled from "styled-components";

export const StyledButton = styled(Button)`
    background-color: var(--orange);
    color: white;
    width: 100px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: var(--yellow);
    }
`;