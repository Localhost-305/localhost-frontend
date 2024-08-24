import { render, screen } from "@testing-library/react";
import Button from "../Button";

const TEXT_MOCK = 'TEXT_MOCK';
const TYPE_BUTTON = 'button'; 
const ID_BUTTON = 'id';
const TEST_ID = 'TEST_ID';

describe('Test button', () => {
    beforeEach(() => {
        render(<Button data-testid={TEST_ID} text={TEXT_MOCK} type={TYPE_BUTTON} id={ID_BUTTON}/>)
    });

    it('should render', () => {
        expect(screen.getByText(TEXT_MOCK)).toBeDefined();
    });

    it('should render type button', () => {
        expect(screen.getByText(TEXT_MOCK)).toHaveProperty('type', TYPE_BUTTON);
    });

    it('should render type button', () => {
        expect(screen.getByText(TEXT_MOCK)).toHaveProperty('id', ID_BUTTON);
    });

})