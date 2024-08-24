import { Input as InputAntd , InputProps as InputPropsAntd } from 'antd';

import styles from '../input/Input.module.css';
import { MarginTitle } from '../../styles/marginTitle.styled';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

export interface InputPropsAD extends InputPropsAntd{
    title?: string;
    margin?: string;
    label?: string;
}

const InputPassword = ({title, margin, label, ...props}: InputPropsAD) => {
    return (
        <div className={styles.div_input} style={{margin}}>
            {title && (<MarginTitle><h3>{title}</h3></MarginTitle>)}
            {label && <label className={styles.label_input}>{label}</label>}
            <InputAntd.Password  
                style={{width: '320px'}}
                size='large'
                placeholder="Senha"
                {...props}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
        </div>
    )
}

export default InputPassword;