import Input from "../../../shared/components/inputs/input/Input";
import Screen from "../../../shared/components/screen/Screen";
import Button from "../../../shared/components/buttons/button/Button";
import SelectFilter from "../../../shared/components/inputs/selectFilter/SelectFilter";
import FirstScreen from "../../firstScreen";
import { useInsertUsers } from "../hooks/useInsertUsers";
import { LimitedContainer } from "../../../shared/components/styles/limited.styled";
import { UserRoutesEnum } from "../routes";
import { brazilStates } from "../../../shared/constants/brazilStates";
import { useLoading } from "../../../shared/components/loadingProvider/LoadingProvider";

const UserInsert = () => {
    const { isLoading, setLoading } = useLoading();
    const { userInsert,
            handleInsert,
            onChange,
            handleChangeSelect,
            errors } = useInsertUsers();

    // BREADCRUMB
    const listBreadcrumb = [
        {
            name: 'Home'
        },
        {
            name: 'Lista de Usuários',
            navigateTo: UserRoutesEnum.USER
        },
        {
            name: 'Inserir Usuários'
        }
    ]

    return(
        <Screen listBreadcrumb={listBreadcrumb}>
            {isLoading && <FirstScreen/>}
            <form onSubmit={(event) => handleInsert(event, setLoading)}>
                <LimitedContainer width={400}>
                    <Input onChange={(event) => onChange(event, 'first_name')} 
                        value={userInsert.first_name} 
                        margin="0px 0px 15px 0px" 
                        label="Primeiro Nome *" 
                        placeholder="Primeiro Nome" 
                        type="text" 
                        id="first_name"/>
                    {errors.first_name && <p style={{color: 'red', fontWeight: 500}}>{errors.first_name}</p>}
                    <Input onChange={(event) => onChange(event, 'last_name')}
                        value={userInsert.last_name} 
                        margin="0px 0px 15px 0px" 
                        label="Ultimo nome *" 
                        placeholder="Ultimo nome" 
                        type="text" 
                        id="last_name" />
                    {errors.last_name && <p style={{color: 'red', fontWeight: 500}}>{errors.last_name}</p>}
                    <Input onChange={(event) => onChange(event, 'email')}
                        value={userInsert.email} 
                        margin="0px 0px 15px 0px" 
                        label="Email *" 
                        placeholder="Email" 
                        type="text" 
                        id="email" />
                    {errors.email && <p style={{color: 'red', fontWeight: 500}}>{errors.email}</p>}
                    <SelectFilter label="Selecionar UF *"
                        margin="0px 0px 15px 0px"
                        onChange={(event) => handleChangeSelect(event,'uf')}
                        defaultValue={'Selecionar'}
                        value={`${userInsert.uf}`}
                        options={[
                            { value: "", label: 'Selecionar' },
                            ...brazilStates.map((braz) => ({
                                value: `${braz.value}`,
                                label: braz.label
                            }))]}/>
                    {errors.uf && <p style={{color: 'red', fontWeight: 500}}>{errors.uf}</p>}
                    <LimitedContainer width={200} style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Button text="Cadastrar" type="submit" id="insert"/>
                    </LimitedContainer>
                </LimitedContainer>
            </form>
        </Screen> 
    )
}

export default UserInsert;