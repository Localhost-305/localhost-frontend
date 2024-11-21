import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import User from '../src/modules/user/screens/User';
import { useRequests } from '../src/shared/hooks/useRequests';
import { useGlobalReducer } from '../src/store/reducers/globalReducer/useGlobalReducer';
import { useUserReducer } from '../src/store/reducers/userReducer/useUserReducer';
import { useLoading } from '../src/shared/components/loadingProvider/LoadingProvider';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../src/store/reducers/userReducer/useUserReducer', () => ({
  useUserReducer: jest.fn(),
}));

jest.mock('../src/shared/hooks/useRequests', () => ({
  useRequests: jest.fn(),
}));

jest.mock('../src/shared/components/loadingProvider/LoadingProvider', () => ({
  useLoading: jest.fn(),
}));

jest.mock('../src/store/reducers/globalReducer/useGlobalReducer', () => ({
  useGlobalReducer: jest.fn(),
}));

  beforeAll(() => {
    global.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query.includes('min-width'), 
      media: query,
      onchange: null,
      addListener: jest.fn(), 
      removeListener: jest.fn(), 
      addEventListener: jest.fn(), 
      removeEventListener: jest.fn(), 
      dispatchEvent: jest.fn(),
    }));
  });

describe('User Screen Integration Test', () => {
  beforeEach(() => {

    (useUserReducer as jest.Mock).mockReturnValue({
      user: [
        { userId: 1, name: 'Davi', email: 'davi@email.com', role: { roleName: 'Admin' } },
      ],
      setUser: jest.fn(),
    });

    (useRequests as jest.Mock).mockReturnValue({
      request: jest.fn((url, callback) => {
        if (url.includes('/roles')) {
          callback([{ id: 1, roleName: 'Admin' }, { id: 2, roleName: 'User' }]);
        }
      }),
    });

    (useLoading as jest.Mock).mockReturnValue({
      isLoading: false,
      setLoading: jest.fn(),
    });

    (useGlobalReducer as jest.Mock).mockReturnValue({
      setNotification: jest.fn(),
    });
  });

  it('should edit a user successfully', async () => {
    render(
      <BrowserRouter>
        <User />
      </BrowserRouter>
    );

    expect(screen.getByText('Davi')).toBeInTheDocument();
    expect(screen.getByText('davi@email.com')).toBeInTheDocument();

    const editButton = await screen.findByTestId('edit-button');
    fireEvent.click(editButton);

    expect(screen.getByText(/dados do usuário/i)).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/nome:/i);
    const emailInput = screen.getByLabelText(/email:/i);

    fireEvent.change(nameInput, { target: { value: 'Joao' } });
    fireEvent.change(emailInput, { target: { value: 'joao@email.com' } });

    expect(nameInput).toHaveValue('Joao');
    expect(emailInput).toHaveValue('joao@email.com');

    const saveButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/sucesso!/i)).toBeInTheDocument();
    });
  });
});
