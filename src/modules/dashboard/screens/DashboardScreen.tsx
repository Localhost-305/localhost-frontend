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
import { Button, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { JobsType } from '../../../shared/types/JobsType';
import { CandidatesType } from '../../../shared/types/CandidatesType';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { MethodsEnum } from '../../../shared/enums/methods.enum';
import { useRequests } from '../../../shared/hooks/useRequests';
import { URL_APPLICATIONS, URL_JOB } from '../../../shared/constants/urls';
import { URL_CANDIDATES } from '../../../shared/constants/urls';
import FirstScreen from '../../firstScreen';
import { StyledCard } from "../../dashboard/styles/Dashboard.style"
 
const DashboardScreen = () => {
  const navigate = useNavigate();
  const { request } = useRequests();
  const [jobs, setJobs] = useState<JobsType[]>([]);
  const [candidates, setCandidates] = useState<CandidatesType[]>([]);
  const [totalAverageTime, setTotalAverageTime] = useState<number>(0);  
  const { isLoading, setLoading } = useLoading();
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
 
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
    setLoading(true);
    request(URL_APPLICATIONS, MethodsEnum.GET, setCandidates).finally(()=>setLoading(false))
  },[])
 
  useEffect(() => {
    setLoading(true);
    request(`${URL_JOB}/jobAverage`, MethodsEnum.GET, setJobs).finally(()=>setLoading(false))
  },[])

  //alterar
  const fetchJobs = (startDate?: string, endDate?: string) => {
    setLoading(true);
    let url = (URL_APPLICATIONS);
    if (startDate && endDate) {
      url += `?startDateStr=${startDate}&endDateStr=${endDate}`;
    }

    request(url, MethodsEnum.GET, setJobs).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dateStrings[0] && dateStrings[1]) {
      setDateRange(dateStrings);
    } else {
      setDateRange(null);
    }
  };

  const handleSearch = () => {
    if (dateRange) {
      const [startDate, endDate] = dateRange;
      fetchJobs(startDate, endDate);
    } else {
      fetchJobs(); // Sem filtro, retorna todos
    }
  };

  useEffect(() => {
    // Calcula o total de tempos médios quando os dados de jobs são atualizados
    const total = jobs.reduce((acc, job) => acc + Number(job.AverageTime), 0);
    setTotalAverageTime(total);
  }, [jobs]);
   

// GRÁFICO
  const chartRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    if (!chartRef.current || jobs.length === 0) return;
 
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);
 
    const jobNames = candidates.map((job: CandidatesType) => job.jobTitle);  
    const candidateCount = candidates.map((job: CandidatesType) => job.count);
 
    const option: EChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
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
          },
          axisLabel: {
            show: false, 
          },
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
          data: candidateCount,
          itemStyle: {
            color: '#fd7e14',
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
 
  const columns: TableColumnsType<JobsType> = [
    {
      title: 'Vaga',
      dataIndex: 'JobTitle',
    },
    {
      title: 'Tempo Médio',
      dataIndex: 'AverageTime',
      sorter: {
        compare: (a, b) => a.AverageTime - b.AverageTime,
        multiple: 3,
      },
    },
  ];
 
 
  return(
    <Screen listBreadcrumb={listBreadcrumb}>
        {isLoading && <FirstScreen/>}
        <RangePicker onChange={handleDateChange} style={{ border: '1px solid var(--orange)'}} />
        <Button icon={<SearchOutlined style={{ color: 'var(--orange)' }} />} onClick={handleSearch} />
        <div ref={chartRef} style={{ width: '100%', height: '300px', marginBottom: '50px' }} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px' }}>
        <Table columns={columns}
          dataSource={jobs}
          bordered style={{ width: '45%', height: '300px' }}
          pagination={{ pageSize: 5 }}
          components={{
            header: {
              cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
                  <th {...props} style={{ backgroundColor: 'var(--orange)', color: 'var(--white)' }}>
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
        <h2 className="card-date"><span>{totalAverageTime} Horas</span></h2>
        </StyledCard>
        </div>
        <BoxButtons>
            <LimitedContainer width={240}></LimitedContainer>
        </BoxButtons>
    </Screen>
  )
};
 
export default DashboardScreen;