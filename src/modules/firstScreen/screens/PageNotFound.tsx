import { Result } from "antd";

import Button from "../../../shared/components/buttons/button/Button";
import styles from "../styles/PageNotFound.module.css";
import { useNavigate } from "react-router-dom";
import { LoginRoutesEnum } from "../../login/routes";

const PageNotFound = () => {
    const navigate = useNavigate();
    const handleOnClick = () => {
        navigate(LoginRoutesEnum.LOGIN);
    }

    return (
        <div className={styles.aling_div}>
            <Result
                status="404"
                title="404"
                subTitle="Desculpe, a página que você está visitando não existe."
                extra={<Button text="Página de Login" onClick={handleOnClick} type="button" id="login"/>}
            />
        </div>
    )
}

export default PageNotFound;