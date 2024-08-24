import { useEffect, useState } from "react";

import Input from "../inputAntd/InputAD";
import styles from './InputMoney.module.css';
import { InputProps } from "../input/Input";

interface InputMoneyProps extends InputProps{
    valueMoney: number | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    addonBefore?: string;
}

const DECIMAL_SIZE: number = 2;

const InputMoney = ({valueMoney, onChange, addonBefore = 'R$', ...props}: InputMoneyProps) => {
    const [currentValue, setCurrentValue] = useState<string>(formatValue(valueMoney));

    useEffect(() => {
        setCurrentValue(formatValue(valueMoney));
    }, [valueMoney]);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace(/\D/g, '');
        const intValue = parseInt(rawValue) / Math.pow(10, DECIMAL_SIZE);
        onChange({
            ...event,
            target: {
                ...event.target,
                value: intValue.toFixed(DECIMAL_SIZE)
            }
        });
    }

    function formatValue(value: number | undefined ): string {
        if(value !== undefined){
            return value
            .toFixed(DECIMAL_SIZE)
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return '0,00';
    }

    return <Input addonBefore={addonBefore} 
                value={currentValue} 
                onChange={handleOnChange} 
                {...props} 
                className={styles.container}/>
}

export default InputMoney;