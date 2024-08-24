import { Input as InputAntd , InputProps as InputPropsAntd } from 'antd';

import styles from '../input/Input.module.css';
import { MarginTitle } from '../../styles/marginTitle.styled';

export interface InputPropsAD extends InputPropsAntd{
    title?: string;
    margin?: string;
    label?: string;
}

const InputAD = ({title, margin, label, ...props}: InputPropsAD) => {
    return (
        <div className={styles.div_input} style={{margin}}>
            {title && (<MarginTitle><h3>{title}</h3></MarginTitle>)}
            {label && <label className={styles.label_input}>{label}</label>}
            <InputAntd
                style={{width: '320px'}}
                size='large'
                {...props}/>
        </div>
    )
}

export default InputAD;