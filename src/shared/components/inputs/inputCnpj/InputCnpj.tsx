import React, { useState } from 'react';

import styles from '../input/Input.module.css';
import { insertMaskInCnpj } from '../../../functions/utils/cnpj';
import { InputProps } from '../input/Input';

export interface InputCnpjsProps extends InputProps {}

const InputCnpj = ({ label, type, id, placeholder, onChange, value, margin }: InputCnpjsProps) => {
    const stringValue = String(value);
    const [inputValue, setInputValue] = useState<string>(stringValue || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maskedValue = insertMaskInCnpj(e.target.value);
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

export default InputCnpj;