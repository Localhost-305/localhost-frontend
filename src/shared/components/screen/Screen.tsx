import { Divider } from 'antd';
import Breadcrumb, { ListBreadcrumb } from '../breadcrumb/Breadcrumb';
import Menu from '../menu/Menu';
import Header from '../header/Header';
import { ScreenContainer } from './Screen.style';

interface ScreenProps {
    children: React.ReactNode;
    listBreadcrumb?: ListBreadcrumb[];
}

const Screen = ({children, listBreadcrumb}: ScreenProps) => {

    return (
        <>
            <Header />
            <ScreenContainer>
                
                { listBreadcrumb && (
                    <>
                        <Breadcrumb listBreadcrumb={listBreadcrumb}/>
                        <Divider/>
                    </>
                
                )}
                {children}
            </ScreenContainer>
        </>
        
    )
}

export default Screen;