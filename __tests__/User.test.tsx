import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import User from '../src/modules/user/screens/User';
import { useRequests } from '../src/shared/hooks/useRequests';
import { useGlobalReducer } from '../src/store/reducers/globalReducer/useGlobalReducer';
import { useUserReducer } from '../src/store/reducers/userReducer/useUserReducer';
import { useLoading } from '../src/shared/components/loadingProvider/LoadingProvider';
import { UserType } from '../src/shared/types/UserType';
import { useUpdateUsers } from '../src/modules/user/hooks/useUpdateUsers';

jest.mock('../src/store/reducers/userReducer/useUserReducer', () => ({
  useUserReducer: jest.fn(),
}));

jest.mock('../src/shared/hooks/useRequests', () => ({
  useRequests: jest.fn(),
}));

jest.mock('../src/store/reducers/globalReducer/useGlobalReducer', () => ({
  useGlobalReducer: jest.fn(),
}));

jest.mock('../src/modules/user/hooks/useUpdateUsers', () => ({
  useUpdateUsers: jest.fn(),
}));

jest.mock('../src/shared/components/loadingProvider/LoadingProvider', () => ({
  useLoading: jest.fn(),
}));


describe('User Component', () => {
  const mockUserData: UserType[] = [
    {
      userId: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: {
        id: 1,
        roleName: 'Admin',
        permissions: [
          { permissionid: 1, permissionName: 'Read' },
          { permissionid: 2, permissionName: 'Write' },
        ],
      },
    },
    {
      userId: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: {
        id: 2,
        roleName: 'User',
        permissions: [
          { permissionid: 3, permissionName: 'Read' },
        ],
      },
    },
  ];

  beforeEach(() => {
    (useUserReducer as jest.Mock).mockReturnValue({
      user: mockUserData,
      setUser: jest.fn(),
    });

    (useRequests as jest.Mock).mockReturnValue({
      request: jest.fn().mockResolvedValue(mockUserData),
    });

    (useLoading as jest.Mock).mockReturnValue({
      isLoading: false,
      setLoading: jest.fn(),
    });

    (useGlobalReducer as jest.Mock).mockReturnValue({
      setNotification: jest.fn(),
    });

    (useUpdateUsers as jest.Mock).mockReturnValue({
      userUpdate: { name: '', email: '' },
      handleUpdate: jest.fn(),
      onChange: jest.fn(),
      setUserUpdate: jest.fn(),
      handleChangeSelect: jest.fn(),
    });
  });

  test('should render the User component and display user data', async () => {
    render(<User />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Pesquisar')).toBeInTheDocument();

    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
  });

  test('should show a modal when the edit button is clicked', async () => {
    render(<User />);

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(screen.getByText('Dados do Usuário')).toBeInTheDocument();
  });

  test('should call the update user function when save changes is clicked', async () => {
    render(<User />);

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(useUpdateUsers().handleUpdate).toHaveBeenCalledTimes(1);
    });
  });

  test('should display an error notification if required fields are empty', async () => {
    render(<User />);

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    expect(await screen.findByText('Campos obrigatórios')).toBeInTheDocument();
  });
});
