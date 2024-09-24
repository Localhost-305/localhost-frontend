import React, { useRef, useEffect, useState } from 'react';
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
import { DatePicker, Space, Card } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { JobsType } from '../../../shared/types/JobsType';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { StyledCard } from "../../dashboard/styles/Dashboard.style"

const DashboardScreen = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobsType[]>([]);
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

  useEffect(() => {
    setJobs([
      {
        "role": "Analista",    
        "quantity": 25
      },
      {
        "role": "Desenvolvedor",
        "quantity": 30
      },
      {
        "role": "DevOps",
        "quantity": 15
      },
      {
        "role": "Designer",
        "quantity": 20
      },
      {
        "role": "Suporte",
        "quantity": 28
      }
    ]);
    fetch('/jobs.json') 
      .then(response => response.json())
      .then(data => setJobs([
        {
          "role": "Analista",    
          "quantity": 25
        },
        {
          "role": "Desenvolvedor",
          "quantity": 30
        },
        {
          "role": "DevOps",
          "quantity": 15
        },
        {
          "role": "Designer",
          "quantity": 20
        },
        {
          "role": "Suporte",
          "quantity": 28
        }
    ]))
      .catch(error => console.error('Erro ao carregar o JSON:', error));
  }, []);


// GRÁFICO
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || jobs.length === 0) return;

    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const jobNames = jobs.map((job: JobsType) => job.role);  
    const jobCandidates = jobs.map((job: JobsType) => job.quantity);

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
          data: jobNames,
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
          name: 'Candidatos',
          type: 'bar',
          barWidth: '60%',
          data: jobCandidates,
          itemStyle: {
            color: '#17A2B8',
            barBorderRadius: [8, 8, 0, 0]
          }
        }
      ]
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [jobs]);


  type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

  const { RangePicker } = DatePicker;

  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
  console.log('onOk: ', value);
  };

  const handleClick = () => {
    setJobs(
      [
        {
          "role": "Analista",    
          "quantity": 10
        },
        {
          "role": "Desenvolvedor",
          "quantity": 9
        },
        {
          "role": "DevOps",
          "quantity": 30
        },
        {
          "role": "Designer",
          "quantity": 40
        },
        {
          "role": "Suporte",
          "quantity": 18
        }
    ]
    )
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Vaga',
      dataIndex: 'role',
    },
    {
      title: 'Tempo Médio',
      dataIndex: 'time',
      sorter: {
        compare: (a, b) => a.time - b.time,
        multiple: 3,
      },
    },
  ];

  interface DataType {
    key: React.Key;
    role: string;
    time: number;
  }
  
  const data: DataType[] = [
    {
      key: '1',
      role: 'Analista',
      time: 91,
    },
    {
      key: '2',
      role: 'Desenvolvedor',
      time: 95,
    },
    {
      key: '3',
      role: 'DevOps',
      time: 98,
    },
    {
      key: '4',
      role: 'Designer',
      time: 88,
    },
  ];

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return(
    <Screen listBreadcrumb={listBreadcrumb}> 
        {isLoading && <DashboardScreen/>}
        <RangePicker style={{ border: '1px solid var(--blue)'}} /> <SearchOutlined onClick={handleClick} style={{ color: 'var(--blue)' }} />
        <div ref={chartRef} style={{ width: '100%', height: '300px', marginBottom: '50px' }} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px' }}>
        <Table<DataType> columns={columns} dataSource={data} onChange={onChange} bordered style={{ width: '50%', height: '300px' }}
        components={{
          header: {
            cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
                <th {...props} style={{ backgroundColor: 'var(--blue)', color: 'var(--white)' }}>
                    {props.children}
                </th>
            )
        }        
        }} />
       <StyledCard 
        bordered
        >
        <div className="card-bg"></div>
        <h1 className="card-title">Tempo Médio</h1>
        <h2 className="card-date"><span> 20 Horas</span></h2>
        </StyledCard>
        </div>
        <BoxButtons>
            <LimitedContainer width={240}></LimitedContainer>
        </BoxButtons>
    </Screen>
  )
};

export default DashboardScreen;