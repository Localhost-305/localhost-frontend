import { SelectProps as SelectPropsAntd, Select as SelectAntd } from 'antd';

import styles from './Select.module.css';
import stylesInput from '../input/Input.module.css';

interface SelectProps extends SelectPropsAntd{
    title?: string;
    margin?: string; 
    label?: string;
}

const Select = ({margin, title, label, ...props}: SelectProps) => {
    return (
        <div className={styles.div_input} style={{ margin }}>
            {title && (<h3 className={styles.title}>{title}</h3>)}
            {label && <label className={stylesInput.label_input}>{label}</label>}
            <SelectAntd {...props} style={{width: '320px', height: '40px', fontSize: '20px'}}/>
        </div>
    )
}

export default Select