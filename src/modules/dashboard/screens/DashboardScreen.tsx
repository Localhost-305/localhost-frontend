import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { useNavigate } from "react-router-dom";
import { getAuthorizationToken } from "../../../shared/functions/connection/auth";
import Screen from "../../../shared/components/screen/Screen";
import { DashboardRoutesEnum } from '../routes';
import { LoginRoutesEnum } from "../../login/routes";
import { LimitedContainer } from "../../../shared/components/styles/limited.styled";
import { BoxButtons } from "../../../shared/components/styles/boxButtons.style";
import { useLoading } from "../../../shared/components/loadingProvider/LoadingProvider";
import { TableProps } from 'antd';
import Table from '../../../shared/components/table/Table';


const DashboardScreen = () => {
  const navigate = useNavigate();
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    const token = getAuthorizationToken();
    if (!token) {
        navigate(LoginRoutesEnum.LOGIN); 
    }
  }, [navigate]);

  const listBreadcrumb = [
    {
        name: 'Dashboard',
        navigateTo: DashboardRoutesEnum.DASHBOARD
    }
]

// GRÁFICO
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option: EChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Cargo', 'Cargo', 'Cargo', 'Cargo', 'Cargo', 'Cargo', 'Cargo'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [100, 152, 200, 334, 310, 230, 120],
          itemStyle: {
            color: '#fd7e14'
          }
        }
      ]
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  // TABELAS
  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }
  
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    }
  ];
  
  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

  return(
      <Screen listBreadcrumb={listBreadcrumb}> 
          {isLoading && <DashboardScreen/>}
          <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
          <BoxButtons>
              <LimitedContainer width={240}>
              </LimitedContainer>
          </BoxButtons>
          <Table columns={columns} dataSource={data} />
      </Screen>
  )
};

export default DashboardScreen;