import { useState } from "react";

import styles from '../input/Input.module.css';
import { InputProps } from "../input/Input";
import { insertMaskInNumber3 } from "../../../functions/utils/number";


export interface InputNumberProps extends InputProps {}

const InputNumber = ({ label, type, id, placeholder, onChange, value, margin }: InputNumberProps) => {
    const [inputValue, setInputValue] = useState<string>(String(value) || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maskedValue = insertMaskInNumber3(e.target.value);
        setInputValue(maskedValue);
        if (onChange) {
            const event = {
                ...e,
                target: {
                    ...e.target,
                    value: maskedValue,
                }
            };
            onChange(event as React.ChangeEvent<HTMLInputElement>);
        }
    };

    return (
        <div className={styles.div_input} style={{ margin }}>
            <label className={styles.label_input}>{label}</label>
            <input
                className={styles.input}
                type={type}
                name={id}
                id={id}
                placeholder={placeholder}
                onChange={handleChange}
                value={inputValue}
            />
        </div>
    );
}

export default InputNumber;