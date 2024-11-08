import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableProps, Select, Input as InputAntd, Modal } from "antd";

import Screen from "../../../shared/components/screen/Screen";
import Table from "../../../shared/components/table/Table";
import Button from "../../../shared/components/buttons/button/Button";
import FirstScreen from "../../firstScreen";
import { Permission, UserType } from "../../../shared/types/UserType";
import { useUserReducer } from "../../../store/reducers/userReducer/useUserReducer";
import { useRequests } from "../../../shared/hooks/useRequests";
import { URL_USER } from "../../../shared/constants/urls";
import { MethodsEnum } from "../../../shared/enums/methods.enum";
import { UserRoutesEnum } from "../routes";
import { formatDateTime } from "../../../shared/functions/utils/date";
import { UserTable } from '../../../shared/components/styles/userTable.style';
import { LimitedContainer } from "../../../shared/components/styles/limited.styled";
import { BoxButtons } from "../../../shared/components/styles/boxButtons.style";
import { useLoading } from "../../../shared/components/loadingProvider/LoadingProvider";
import { DashboardRoutesEnum } from "../../dashboard/routes";
import { StyledButton } from "../../../shared/components/styles/styledButton.style";
import { Button as AntdButton } from "antd";
import { EditTwoTone } from "@ant-design/icons";

const User = () => {
    const {user, setUser} = useUserReducer();
    const {request} = useRequests();
    const { isLoading, setLoading } = useLoading();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [roleName, setRoleName] = useState("");
    const currentUser: UserType | null = user.length > 0 ? user[0] : null;

    const hasChangePermission = currentUser?.role?.permissions?.some(
    (permission: Permission) => permission.permissionid === 2
    );

    // EVENTS
    useEffect(() => {
        setLoading(true);
        request(URL_USER, MethodsEnum.GET, (data) => {
            const mappedUsers = data.map((user: any) => ({
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role ? {
                    id: user.role.id,
                    roleName: user.role.roleName,
                    permissions: user.role.permissions
                } : null
            }));
            
            setUser(mappedUsers);
            setLoading(false);
        });
    }, []);    
    
    useEffect(() => {
        setObjectFiltered([...user])
    }, [user]);

    const showEditModal = (user: UserType) => {
        if (!hasChangePermission) {
            alert("Você não tem permissão para editar este usuário.");
            return;
        }
        setSelectedUser(user);
        setName(user.name);
        setEmail(user.email);
        setRoleName(user.role ? user.role.roleName : "");
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedUser(null);
    };

    const handleSaveChanges = () => {
        handleCloseModal();
    };

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
            dataIndex: 'userId',
            key: 'userId',
            width: 80,
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
            dataIndex: 'roleName',
            key: 'roleName',
            render: (_, user) => <p>{user.role ? user.role.roleName : "N/A"}</p>,
        },
        {
            title: 'Ações',
            key: 'action',
            width: 80,
            render: (_, user) => (
                <EditTwoTone type="button" id="edit" style={{ fontSize: '30px' }} twoToneColor='#007BFF' onClick={() => showEditModal(user)} />
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
                rowKey={(object) => object.userId}
                scroll={{y:550, x:900}}
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
            <Modal
                title="Dados do Usuário"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <AntdButton key="cancel" onClick={handleCloseModal}>Cancelar</AntdButton>,
                    <AntdButton key="submit" type="primary" onClick={handleSaveChanges}>Salvar</AntdButton>,
                ]}
                >
                {selectedUser && (
                    <div>
                        <p><strong>ID:</strong> {selectedUser.userId}</p>
                        <label><strong>Nome:</strong></label>
                        <InputAntd value={name} onChange={(e) => setName(e.target.value)} />

                        <label><strong>Email:</strong></label>
                        <InputAntd value={email} onChange={(e) => setEmail(e.target.value)} />

                        <label><strong>Cargo:</strong></label>
                        <InputAntd value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                    </div>
                )}
            </Modal>
        </Screen>
    )
}

export default User;