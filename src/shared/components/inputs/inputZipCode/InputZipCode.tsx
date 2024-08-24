import React, { useState } from 'react';

import styles from '../input/Input.module.css';
import { InputProps } from '../input/Input';
import { Address, getDataByZipCode, insertMaskInZipCode } from '../../../functions/utils/zipCode';

export interface InputZipCodeProps extends InputProps {
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onAddressFetched?: (address: Address) => void;
}

const InputZipCode = ({ label, type, id, placeholder, onChange, value, margin, onBlur, onAddressFetched }: InputZipCodeProps) => {
    
    const [inputValue, setInputValue] = useState<string>(String(value));

    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        if (onBlur) {
            onBlur(e);
        }

        try {
            const address = await getDataByZipCode(e.target.value);
            if (onAddressFetched) {
                onAddressFetched(address);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maskedValue = insertMaskInZipCode(e.target.value);
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
                onBlur={handleBlur}
                value={inputValue}
            />
        </div>
    );
}

export default InputZipCode;