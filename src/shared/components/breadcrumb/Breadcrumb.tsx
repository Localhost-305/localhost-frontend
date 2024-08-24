import { Breadcrumb as BreadcrumbAntd } from 'antd';


export interface ListBreadcrumb{
    name: string;
    navigateTo?: string;
}


interface BreadcrumbProps{
    listBreadcrumb: ListBreadcrumb[];
}

const Breadcrumb = ({ listBreadcrumb }: BreadcrumbProps) => {

    const breadcrumbItems = listBreadcrumb.map((item) => ({
        title: item.navigateTo ? <a href={item.navigateTo}>{item.name}</a> : item.name,
    }));

    return <BreadcrumbAntd items={breadcrumbItems} />;
};

export default Breadcrumb;