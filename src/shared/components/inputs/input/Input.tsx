import styles from '../input/Input.module.css';

export interface InputProps{
    label:string;
    type:string;
    id:string;
    placeholder?:string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string | number;
    margin?: string;
    accept?: string;
}

const Input = ({label, type, id, placeholder, onChange, value, margin, accept}: InputProps) => {
    return (
        <div className={styles.div_input} style={{margin}}>
            <label className={styles.label_input}>{label}</label>
            <input 
                className={styles.input} 
                type={type} 
                name={id} 
                id={id} 
                placeholder={placeholder} 
                onChange={onChange} 
                value={value}
                accept={accept}
            ></input>
        </div>
    )
}

export default Input