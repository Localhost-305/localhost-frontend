import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableProps, Select, Input as InputAntd } from "antd";

import Screen from "../../../shared/components/screen/Screen";
import Table from "../../../shared/components/table/Table";
import Button from "../../../shared/components/buttons/button/Button";
import FirstScreen from "../../firstScreen";
import { UserType } from "../../../shared/types/UserType";
import { useUserReducer } from "../../../store/reducers/userReducer/useUserReducer";
import { useRequests } from "../../../shared/hooks/useRequests";
import { URL_USER } from "../../../shared/constants/urls";
import { MethodsEnum } from "../../../shared/enums/methods.enum";
import { UserRoutesEnum } from "../routes";
import { formatDateTime } from "../../../shared/functions/utils/date";
import { LimitedContainer } from "../../../shared/components/styles/limited.styled";
import { BoxButtons } from "../../../shared/components/styles/boxButtons.style";
import { useLoading } from "../../../shared/components/loadingProvider/LoadingProvider";
import { DashboardRoutesEnum } from "../../dashboard/routes";
import { StyledButton } from "../../../shared/components/styles/styledButton.style";

const User = () => {
    const {user, setUser} = useUserReducer();
    const {request} = useRequests();
    const { isLoading, setLoading } = useLoading();

    // EVENTS
    useEffect(() => {
        setLoading(true);
        request(URL_USER, MethodsEnum.GET, setUser)
        .then(() => setLoading(false));
    }, []);

    useEffect(() => {
        setObjectFiltered([...user])
    }, [user]);

    // BREADCRUMB
    const listBreadcrumb = [
        {
            name: 'Dashboard',
            navigateTo: DashboardRoutesEnum.DASHBOARD
        },
        {
            name: 'Lista de Usuários',
            navigateTo: UserRoutesEnum.USER
        }
    ]

    // NAVIGATE TO
    const navigate = useNavigate();
    const handleInsert = () => {
        navigate(UserRoutesEnum.USER_INSERT);
    }

    const columns: TableProps<UserType>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            render: (_,user) => <p>{`${user.name}`}</p>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Cargo',
            dataIndex: 'function',
            key: 'function',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Editar',
            key: 'edit',
            render: () => (
                <StyledButton type="button" id="edit" onClick={handleInsert}>
                    Editar
                </StyledButton>
            ),
        }
    ];

    // Search ANTD
    const [ objectFiltered, setObjectFiltered ] = useState<UserType[]>([]);
    const [ filterColumn, setFilterColumn ] = useState<string>('name');
    const { Option } = Select;
    const { Search } = InputAntd;
    const onSearch = (value: string) => {
        if (!value) {
            setObjectFiltered([...user]);
        } else {
            const filteredObjects = user.filter((object) => {
                const fieldValue = (object as any)[filterColumn];
                if (filterColumn === 'name'){
                    return `${object.name}`.toLowerCase().includes(value.toLowerCase());
                }
                if (typeof fieldValue === 'string') {
                    return fieldValue.toLowerCase().includes(value.toLowerCase());
                }
                return false;
                
            });
            setObjectFiltered(filteredObjects);
        }
    };
    const handleFilterColumnChange = (value: string) => {
        setFilterColumn(value);
    };


    return(
        <Screen listBreadcrumb={listBreadcrumb}> 
            {isLoading && <FirstScreen/>}
            
            <BoxButtons>
                <LimitedContainer width={240}>
                    <Select defaultValue="name" onChange={handleFilterColumnChange} style={{ width: 180, marginBottom: '8px' }}>
                        <Option value="name">Nome</Option>
                        <Option value="email">E-mail</Option>
                        <Option value="function">Cargo</Option>
                    </Select>
                    <Search placeholder="Pesquisar" onSearch={onSearch} enterButton/>
                </LimitedContainer>
            </BoxButtons>
            <Table columns={columns} dataSource={objectFiltered} rowKey={(objectFiltered) => objectFiltered.id} scroll={{y:550, x:1000}}/>
        </Screen>
    )
}

export default User;