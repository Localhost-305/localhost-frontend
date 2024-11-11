import { SetStateAction, useEffect, useState } from "react";
import { TableProps, notification, Select, Input as InputAntd, Modal, Button as AntdButton } from "antd";
import { EditTwoTone } from "@ant-design/icons";

import Screen from "../../../shared/components/screen/Screen";
import FirstScreen from "../../firstScreen";
import { UserType } from "../../../shared/types/UserType";
import { useUserReducer } from "../../../store/reducers/userReducer/useUserReducer";
import { useRequests } from "../../../shared/hooks/useRequests";
import { URL_USER } from "../../../shared/constants/urls";
import { MethodsEnum } from "../../../shared/enums/methods.enum";
import { UserTable } from '../../../shared/components/styles/userTable.style';
import { LimitedContainer } from "../../../shared/components/styles/limited.styled";
import { BoxButtons } from "../../../shared/components/styles/boxButtons.style";
import { useLoading } from "../../../shared/components/loadingProvider/LoadingProvider";
import { DashboardRoutesEnum } from "../../dashboard/routes";
import { useUpdateUsers } from "../hooks/useUpdateUsers";
import { PERMISSIONS } from '../../../shared/constants/authorizationConstants';
import { getItemStorage } from "../../../shared/functions/connection/storageProxy";

const User = () => {
    const { user, setUser } = useUserReducer();
    const { request } = useRequests();
    const { isLoading, setLoading } = useLoading();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [roleName, setRoleName] = useState("");
    const { userUpdate, handleUpdate, onChange, setUserUpdate } = useUpdateUsers();

    useEffect(() => {
        setLoading(true);
        request(URL_USER, MethodsEnum.GET, setUser).then(() => setLoading(false));
    }, []);

    useEffect(() => {
        setObjectFiltered([...user])
    }, [user]);

    const showEditModal = (user: UserType) => {
        const permissions = getItemStorage(PERMISSIONS);

        if (!permissions?.includes('allowed_to_change')) {
            notification.error({
                message: 'Acesso negado',
                description: 'Você não tem permissão!',
                placement: 'topRight',
            });
            return;
        }

        setSelectedUser(user);
        setIsModalVisible(true);

        setUserUpdate({
            name: user.name,
            email: user.email
        });
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedUser(null);
    };

    const handleSaveChanges = async () => {
        if (!userUpdate.name || !userUpdate.email) {
            notification.error({
                message: 'Campos obrigatórios',
                description: 'Preencha os campos vazios!',
                placement: 'topRight',
            });
            return;
        }

        if (selectedUser) {
            setLoading(true);

            try {
                await handleUpdate(selectedUser, setLoading);

                handleCloseModal();

                notification.success({
                    message: 'Sucesso!',
                    description: 'Os dados do usuário foram atualizados com sucesso!.',
                    placement: 'topRight',
                    onClose: () => window.location.reload()
                });

            } catch (error) {
                console.error("Erro ao atualizar:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    // BREADCRUMB
    const listBreadcrumb = [
        {
            name: 'Home',
            navigateTo: DashboardRoutesEnum.DASHBOARD
        },
        {
            name: 'Lista de Usuários'
        }
    ];

    // TABLE
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
            render: (_, user) => <p>{`${user.name}`}</p>,
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
    const [objectFiltered, setObjectFiltered] = useState<UserType[]>([]);
    const [filterColumn, setFilterColumn] = useState<string>('name');
    const { Option } = Select;
    const { Search } = InputAntd;
    const onSearch = (value: string) => {
        if (!value) {
            setObjectFiltered([...user]);
        } else {
            const filteredObjects = user.filter((object) => {
                const fieldValue = (object as any)[filterColumn];
                if (filterColumn === 'name') {
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


    return (
        <Screen listBreadcrumb={listBreadcrumb}>
            {isLoading && <FirstScreen />}
            <BoxButtons>
                <LimitedContainer width={240}>
                    <Select defaultValue="name" onChange={handleFilterColumnChange} style={{ width: 180, marginBottom: '8px' }}>
                        <Option value="name">Nome</Option>
                        <Option value="email">E-mail</Option>
                        <Option value="roleName">Cargo</Option>
                    </Select>
                    <Search placeholder="Pesquisar" onSearch={onSearch} enterButton style={{ width: 250 }} />
                </LimitedContainer>
            </BoxButtons>
            <UserTable
                columns={columns as any}
                className="table-user"
                dataSource={objectFiltered}
                rowKey={(object) => (object as UserType).userId}
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
            <Modal
                title="Dados do Usuário"
                open={isModalVisible}
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
                        <InputAntd
                            value={userUpdate.name}
                            onChange={(e) => onChange(e, 'name')}
                        />

                        <label><strong>Email:</strong></label>
                        <InputAntd
                            value={userUpdate.email}
                            onChange={(e) => onChange(e, 'email')}
                        />

                        <label><strong>Cargo:</strong></label>
                        <InputAntd value={roleName} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setRoleName(e.target.value)} />
                    </div>
                )}
            </Modal>
        </Screen>
    )
}

export default User;