import {ButtonStyled} from './button.styled';

interface ButtonProps{
    text: string;
    type: "button"|"submit"|"reset";
    id: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    color?: 'beige' | 'green';
    title?: string;
}

const Button = ({text, type, id, onClick, color, title}: ButtonProps) => {
    return (
        <ButtonStyled key={id} 
            id={id} 
            type={type} 
            onClick={onClick}
            color={color}
            title={title}>
                {text}
        </ButtonStyled>
    )
    
}

export default Button;