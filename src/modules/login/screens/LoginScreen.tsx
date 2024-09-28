import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
import '../styles/LoginScreen.module.css';
import background from '../../../../public/logo local.svg';
import FirstScreen from '../../firstScreen';
import Button from '../../../shared/components/buttons/button/Button';
import styles from '../styles/LoginScreen.module.css';
import Logo from '../../../../public/logo-sem-fundo.png';
import InputPassword from '../../../shared/components/inputs/inputPasswordAntd/InputPassword';
import InputAD from '../../../shared/components/inputs/inputAntd/InputAD';
import { useRequests } from '../../../shared/hooks/useRequests';
import { useLoading } from '../../../shared/components/loadingProvider/LoadingProvider';
import { DashboardRoutesEnum } from '../../dashboard/routes'; 
 
const LoginScreen = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { isLoading, setLoading } = useLoading();
    const navigate = useNavigate();
 
    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }
    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }  
 
    //  POST REQUEST
    const { authRequest } = useRequests();
 
    const handleLogin = () => {
        setLoading(true);
        authRequest({
            email: email,
            password: password
        }, navigate)
        .then(() => {
            navigate(DashboardRoutesEnum.DASHBOARD); 
            setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    
    return (
        <div className={styles.container_login_screen}>
            {isLoading && <FirstScreen/>}
            <div className={styles.container_login}>
                <div className={styles.div_logo}>
                    <img src={Logo} style={{width:'170px'}}/>
                    <h1 className={styles.title}>Login</h1>
                    <InputAD label='Email'
                        margin="0px 0px 16px 0px"
                        type='email'
                        id='email'
                        placeholder='Email'
                        onChange={handleEmail}
                        value={email}/>
                    <InputPassword label='Senha'
                        margin="0px 0px 16px 0px"
                        type='password'
                        id='password'
                        onChange={handlePassword}
                        value={password}/>
                    <Button text='ENTRAR'
                        type='submit'
                        id='login'
                        onClick={() => handleLogin()}/>
                </div>
            </div>
            <img className={styles.background_image} src={background}></img>
        </div>
    )
}
 
export default LoginScreen;
 