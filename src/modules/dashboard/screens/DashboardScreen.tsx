import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { Table, Button, DatePicker, TableColumnsType, Tooltip, Modal } from 'antd';
import { QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';

import '../../../shared/components/styles/customTooltip.css';
import Screen from "../../../shared/components/screen/Screen";
import FirstScreen from '../../firstScreen';
import { Dayjs } from 'dayjs';
import { DashboardRoutesEnum } from '../routes';
import { LimitedContainer } from "../../../shared/components/styles/limited.styled";
import { useLoading } from "../../../shared/components/loadingProvider/LoadingProvider";
import { JobsType } from '../../../shared/types/JobsType';
import { CandidatesType } from '../../../shared/types/CandidatesType';
import { MethodsEnum } from '../../../shared/enums/methods.enum';
import { useRequests } from '../../../shared/hooks/useRequests';
import { URL_APPLICATIONS, URL_JOB } from '../../../shared/constants/urls';
import { StyledCard } from "../../dashboard/styles/Dashboard.style"
import { useGlobalReducer } from '../../../store/reducers/globalReducer/useGlobalReducer';
import { NotificationEnum } from '../../../shared/types/NotificationType';
import { ContainerRowResponsive } from '../../../shared/components/styles/containerRowResponsive.style';
import { JobAverageAllType } from '../../../shared/types/JobAverageAllType';


const DashboardScreen = () => {
  const { request } = useRequests();
  const { setNotification } = useGlobalReducer();
  const [ jobs, setJobs ] = useState<JobsType[]>([]);
  const [ candidates, setCandidates ] = useState<CandidatesType[]>([]);
  const [ jobsAverageAll, setJobsAverageAll ] = useState<JobAverageAllType[]>([]);
  const { isLoading, setLoading } = useLoading();
  const { RangePicker } = DatePicker;
  const [ startDateStr, setStartDateStr ] = useState<Dayjs | null>(null);
  const [ endDateStr, setEndDateStr ] = useState<Dayjs | null>(null);

  // BREADCRUMB
  const listBreadcrumb = [
    {
      name: 'Dashboard',
      navigateTo: DashboardRoutesEnum.DASHBOARD
    }
  ]

  // EVENTS
  useEffect(() => {
    setLoading(true);
    try{
      request(URL_APPLICATIONS, MethodsEnum.GET, setCandidates);
      request(`${URL_JOB}/jobAverage`, MethodsEnum.GET, setJobs);
      request(`${URL_JOB}/jobAverageAll`, MethodsEnum.GET, setJobsAverageAll);
    }catch(error){
      setNotification(String(error), NotificationEnum.ERROR);
    }finally{
      setLoading(false);
    }
  }, [])


  // ECHARTS
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

  // TABLES
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

  // UTILS
  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates) {
      setStartDateStr(dates[0]);
      setEndDateStr(dates[1]);
    } else {
      setStartDateStr(null);
      setEndDateStr(null);
    }
  }

  const handleSearch = () => {
    if(startDateStr && endDateStr) {
      request(
        `${URL_JOB}/jobAverageAll?startDateStr=${startDateStr.format('YYYY-MM-DD')}&endDateStr=${endDateStr.format('YYYY-MM-DD')}`, 
        MethodsEnum.GET, 
        setJobsAverageAll);
      console.log(startDateStr.format('YYYY-MM-DD'));
      console.log(endDateStr.format('YYYY-MM-DD'));
    }else{
      try{
        request(URL_APPLICATIONS, MethodsEnum.GET, setCandidates);
        request(`${URL_JOB}/jobAverage`, MethodsEnum.GET, setJobs);
        request(`${URL_JOB}/jobAverageAll`, MethodsEnum.GET, setJobsAverageAll);
      }catch(error){
        setNotification(String(error), NotificationEnum.ERROR);
      }finally{
        setLoading(false);
      }
    }
   
  }

  // MODAL DOUBTS
  const [ isModalDoubtsOpen, setIsModalDoubtsOpen ] = useState(false);
  const [ contentDoubt, setContentDoubt ] = useState<String>('');
  const [ titleDoubt, setTitleDoubt ] = useState<String>('');

  const showModalDoubts = (title: string, content: string) => {
      setTitleDoubt(title);
      setContentDoubt(content);
      setIsModalDoubtsOpen(true);
  }

  return (
    <Screen listBreadcrumb={listBreadcrumb}>
      {isLoading && <FirstScreen />}

      <h1>Dashboard dos Dados de Contratação</h1>
      <RangePicker key={'datePicker'} onChange={(event) => handleDateChange(event)} style={{ border: '1px solid var(--orange)', marginBottom: '1em'}} />
      <Button key={'search'} icon={ <SearchOutlined style={{ color: 'var(--orange)'}} /> } 
        onClick={handleSearch} />

      <ContainerRowResponsive maxWidth={'800px'}>
        <Table columns={columns}
              dataSource={jobs}
              bordered style={{ width: '45%', height: '300px' }}
              pagination={{ pageSize: 5 }}
              rowKey={(doc) => doc.JobTitle}
              components={{
                header: {
                  cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
                    <th {...props} style={{ backgroundColor: 'var(--orange)', color: 'var(--white)' }}>
                      {props.children}
                    </th>
                  )
                }
              }} />
        <Tooltip title="Tempo médio de contratação por cargo" overlayClassName="custom-tooltip">
          <QuestionCircleOutlined style={{marginBottom: '15em'}}
              onClick={() => 
                showModalDoubts('Tempo médio de contratação por cargo',
                'Nesta tabela mostra o tempo médio de contratação por vaga considerando a hora de abertura e a hora de encerramento, dos cargos.')} />
        </Tooltip>
          
        <StyledCard bordered>
          <div className="card-bg"></div>
          <h1 className="card-title">Tempo Médio</h1>
          <h2 className="card-date"><span>{jobsAverageAll.length > 0 ? jobsAverageAll[0].AverageTime : 0} Horas</span></h2>
        </StyledCard>
        <Tooltip title="Tempo médio de contratação" overlayClassName="custom-tooltip">
          <QuestionCircleOutlined style={{marginBottom: '15em'}}
              onClick={() => 
                showModalDoubts('Tempo médio',
                'Neste cartão mostra o tempo médio de contratação geral considerando a hora de abertura e a hora de encerramento, dos cargos.')} />
        </Tooltip>
        
      </ContainerRowResponsive>

      <LimitedContainer width={800}>
        <h2>Quantidade de Candidaturas por Cargo</h2>
        <small>Neste gráfico mostra a quantidade de candidaturas feitas for cargo</small>
        <div key={'echarts'} ref={chartRef} style={{ width: '100%', height: '300px', marginBottom: '50px' }} />
      </LimitedContainer>

      <Modal title={titleDoubt} 
          open={isModalDoubtsOpen} 
          onOk={() => setIsModalDoubtsOpen(false)} 
          onCancel={() => setIsModalDoubtsOpen(false)}>
          <p>{contentDoubt}</p>
      </Modal>
      
    </Screen>
  )
};

export default DashboardScreen;