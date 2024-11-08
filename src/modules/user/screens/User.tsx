import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableProps, Select, Input as InputAntd } from "antd";

import Screen from "../../../shared/components/screen/Screen";
import FirstScreen from "../../firstScreen";
import { UserType } from "../../../shared/types/UserType";
import { useUserReducer } from "../../../store/reducers/userReducer/useUserReducer";
import { useRequests } from "../../../shared/hooks/useRequests";
import { URL_USER } from "../../../shared/constants/urls";
import { MethodsEnum } from "../../../shared/enums/methods.enum";
import { UserRoutesEnum } from "../routes";
import { UserTable } from '../../../shared/components/styles/userTable.style';
import { LimitedContainer } from "../../../shared/components/styles/limited.styled";
import { BoxButtons } from "../../../shared/components/styles/boxButtons.style";
import { useLoading } from "../../../shared/components/loadingProvider/LoadingProvider";
import { DashboardRoutesEnum } from "../../dashboard/routes";
import { EditTwoTone } from "@ant-design/icons";

const User = () => {
    const {user, setUser} = useUserReducer();
    const {request} = useRequests();
    const { isLoading, setLoading } = useLoading();

    // EVENTS
    useEffect(() => {
        setLoading(true);
        request(URL_USER, MethodsEnum.GET, (data) => {
            const mappedUsers = data.map((user: any) => ({
                id: user.userId,
                name: user.name,
                email: user.email,
                createdOn: user.createdOn,
                updatedOn: user.updatedOn,
                roleName: user.role?.roleName || '' 
            }));
            setUser(mappedUsers);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setObjectFiltered([...user])
    }, [user]);

    // BREADCRUMB
    const listBreadcrumb = [
        {
            name: 'Home',
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
            width: 50,
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            render: (_,user) => <p>{`${user.name}`}</p>,
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <p>{text}</p>,
            width: 150,
        },
        {
            title: 'Cargo',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (text) => <p>{text}</p>,
            width: 100,
        },
        {
            title: 'Ações',
            key: 'action',
            width: 50,
            align: 'center',
            render: () => (
                <EditTwoTone type="button" id="edit" style={{ fontSize: '30px' }} twoToneColor='#007BFF' onClick={handleInsert} />
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
                        <Option value="roleName">Cargo</Option>
                    </Select>
                    <Search placeholder="Pesquisar" onSearch={onSearch} enterButton style={{ width: 250 }}/>
                </LimitedContainer>
            </BoxButtons>
            <UserTable
                columns={columns as any}
                className="table-user"
                dataSource={objectFiltered}
                rowKey={(object) => object.id} 
                scroll={{ y: 550, x: 900 }}
                bordered
                pagination={{ pageSize: 5 }}
                components={{
                    header: {
                        cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
                            <th {...props} style={{ backgroundColor: 'var(--orange)', color: 'var(--white)' }}>
                                {props.children}
                            </th>
                        ),
                    },
                }}
            />
        </Screen>
    )
}

export default User;