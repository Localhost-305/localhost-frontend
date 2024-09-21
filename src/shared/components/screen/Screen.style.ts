import styled from "styled-components";

export const ScreenContainer = styled.header`
    background-color: white;
    padding: 20px;
    margin: 32px;
    margin-left: auto;
    width: 90%;

    @media (max-width: 1200px) {
        width: calc(100% - 282px);
        margin: 0px;
        margin-left: 240px;
    }

    @media (max-width: 768px) {
        width: calc(100% - 142px);
        margin: 0px;
        margin-left: 100px;
    }
`;
