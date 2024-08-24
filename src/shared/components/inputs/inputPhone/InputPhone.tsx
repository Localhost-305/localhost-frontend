import { useState } from 'react';

import styles from '../input/Input.module.css';
import { InputProps } from '../input/Input';
import { insertMaskInPhone } from '../../../functions/utils/phone';

export interface InputPhoneProps extends InputProps {}

const InputPhone = ({ label, type, id, placeholder, onChange, value, margin }: InputPhoneProps) => {
    const stringValue = String(value);
    const [inputValue, setInputValue] = useState<string>(stringValue || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maskedValue = insertMaskInPhone(e.target.value);
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

export default InputPhone;