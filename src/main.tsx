import ReactDOM from 'react-dom/client';
import { store } from './store';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/es/locale/pt_BR';

import './main.css';
import App from './App';
import { LoadingProvider } from './shared/components/loadingProvider/LoadingProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ConfigProvider locale={ptBR}>
      <LoadingProvider>
        <App/>
      </LoadingProvider>
    </ConfigProvider>
  </Provider>
)
