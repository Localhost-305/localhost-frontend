import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { Table, Button, DatePicker, TableColumnsType, Tooltip, Modal, Upload } from 'antd';
import { QuestionCircleOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import axios from "axios";

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
import { URL_APPLICATIONS, URL_HIRING, URL_JOB } from '../../../shared/constants/urls';
import { StyledCard } from "../../dashboard/styles/Dashboard.style"
import { useGlobalReducer } from '../../../store/reducers/globalReducer/useGlobalReducer';
import { NotificationEnum } from '../../../shared/types/NotificationType';
import { ContainerRowResponsive } from '../../../shared/components/styles/containerRowResponsive.style';
import { JobAverageAllType } from '../../../shared/types/JobAverageAllType';
import { BoxButtons } from '../../../shared/components/styles/boxButtons.style';
import { getItemStorage } from '../../../shared/functions/connection/storageProxy';
import { AUTHORIZARION_KEY } from '../../../shared/constants/authorizationConstants';
import { HiringCostType } from '../../../shared/types/HiringCostType';
import { convertNumberToMoney } from '../../../shared/functions/utils/money';

const DashboardScreen = () => {
  const { request } = useRequests();
  const { setNotification } = useGlobalReducer();
  const [jobs, setJobs] = useState<JobsType[]>([]);
  const [candidates, setCandidates] = useState<CandidatesType[]>([]);
  const [jobsAverageAll, setJobsAverageAll] = useState<JobAverageAllType[]>([]);
  const { isLoading, setLoading } = useLoading();
  const { RangePicker } = DatePicker;
  const [startDateStr, setStartDateStr] = useState<Dayjs | null>(null);
  const [endDateStr, setEndDateStr] = useState<Dayjs | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [monthlyCosts, setMonthlyCosts] = useState<HiringCostType[]>([]);

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
    try {
      request(`${URL_APPLICATIONS}/jobs`, MethodsEnum.GET, setCandidates);
      request(`${URL_JOB}/jobAverage`, MethodsEnum.GET, setJobs);
      request(`${URL_JOB}/jobAverageAll`, MethodsEnum.GET, setJobsAverageAll);
      request(`${URL_HIRING}/cost?startDate=${startDateStr ? startDateStr : "2000-01-01"}&endDate=${endDateStr ? endDateStr : "3000-01-01"}`, MethodsEnum.GET, setMonthlyCosts);
    } catch (error) {
      setNotification(String(error), NotificationEnum.ERROR);
    } finally {
      setLoading(false);
    }
  }, [])

  const chartRef = useRef<HTMLDivElement>(null);
  const chartRefCosts = useRef<HTMLDivElement>(null);

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
            color: '#007BFF',
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

  //custo
  useEffect(() => {
    if (!chartRefCosts.current || monthlyCosts.length === 0) return;
    const chartDom = chartRefCosts.current;
    const myChart = echarts.init(chartDom);

    const sortedCosts = monthlyCosts.sort((a: HiringCostType, b: HiringCostType) => {
      if (a.ano === b.ano) {
        return a.mes - b.mes;
      }
      return a.ano - b.ano;
    });
    const orderedMonths = sortedCosts.map((hiring: HiringCostType) => `${String(hiring.mes).padStart(2, '0')}-${hiring.ano}`);
    const totalCosts = sortedCosts.map((hiring: HiringCostType) => hiring.somaDoCusto);

    const totalSum = totalCosts.reduce((acc, cost) => acc + cost, 0);

    const averageCost = totalSum / (totalCosts.length || 1);
    const formattedAverageCost = `R$ ${convertNumberToMoney(averageCost)}`;


    const option: EChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: EChartOption.Tooltip.Format | EChartOption.Tooltip.Format[]) => {
          if (Array.isArray(params) && params.length > 0) {
            const value: number | any = params[0].value;
            return `${convertNumberToMoney(value)} - ${params[0].axisValue}`;
          } else if (!Array.isArray(params) && params.value) {
            const value: number | any = params.value;
            return convertNumberToMoney(value);
          } else {
            return "";
          }
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
          data: orderedMonths,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => {return convertNumberToMoney(value)}
          }
        }
      ],
      series: [
        {
          name: 'Custo Total',
          type: 'bar',
          barWidth: '60%',
          data: totalCosts,
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          markLine: {
            data: [{ yAxis: averageCost, name: `Avg (R$ ${formattedAverageCost})` }]
          }
        }
      ]
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [monthlyCosts]);

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
    if (startDateStr && endDateStr) {
      request(
        `${URL_JOB}/jobAverageAll?startDateStr=${startDateStr.format('YYYY-MM-DD')}&endDateStr=${endDateStr.format('YYYY-MM-DD')}`,
        MethodsEnum.GET,
        setJobsAverageAll);
      request(
        `${URL_JOB}/jobAverage?startDateStr=${startDateStr.format('YYYY-MM-DD')}&endDateStr=${endDateStr.format('YYYY-MM-DD')}`,
        MethodsEnum.GET,
        setJobs);
      request(`${URL_APPLICATIONS}/jobs?startDateStr=${startDateStr.format('YYYY-MM-DD')}&endDateStr=${endDateStr.format('YYYY-MM-DD')}`,
        MethodsEnum.GET,
        setCandidates);
      request(`${URL_HIRING}/cost?startDate=${startDateStr.format('YYYY-MM-DD')}&endDate=${endDateStr.format('YYYY-MM-DD')}`,
        MethodsEnum.GET,
        setMonthlyCosts);
    } else {
      try {
        request(URL_APPLICATIONS, MethodsEnum.GET, setCandidates);
        request(`${URL_JOB}/jobAverage`, MethodsEnum.GET, setJobs);
        request(`${URL_JOB}/jobAverageAll`, MethodsEnum.GET, setJobsAverageAll);
        request(`${URL_HIRING}/cost`, MethodsEnum.GET, setMonthlyCosts);
      } catch (error) {
        setNotification(String(error), NotificationEnum.ERROR);
      } finally {
        setLoading(false);
      }
    }
  }

  // MODAL DOUBTS
  const [isModalDoubtsOpen, setIsModalDoubtsOpen] = useState(false);
  const [contentDoubt, setContentDoubt] = useState<String>('');
  const [titleDoubt, setTitleDoubt] = useState<String>('');

  const showModalDoubts = (title: string, content: string) => {
    setTitleDoubt(title);
    setContentDoubt(content);
    setIsModalDoubtsOpen(true);
  }

  // EXCEL
  const handleBeforeUpload = (file: File) => {
    const isExcel = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) setNotification("Você só pode enviar arquivos .xlsx!", NotificationEnum.ERROR);

    return isExcel || Upload.LIST_IGNORE;
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      setNotification("Por favor, envie um arquivo primeiro!", NotificationEnum.ERROR);
      return;
    }

    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj);

    try {
      const response = await axios.post("http://localhost:9090/excel/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${getItemStorage(AUTHORIZARION_KEY)}`
        },
      });
      setNotification("Arquivo enviado com sucesso!", NotificationEnum.SUCCESS);
    } catch (error) {
      setNotification("Erro ao enviar o arquivo!", NotificationEnum.ERROR);
      console.error("Upload Error:", error);
    }
  };

  const onChange = (info: any) => {
    setFileList(info.fileList.slice(-1)); // Mantém apenas o último arquivo enviado
  };


  return (
    <Screen listBreadcrumb={listBreadcrumb}>
      {isLoading && <FirstScreen />}

      <h1>Dashboard dos Dados de Contratação</h1>
      <BoxButtons>
        <div>
          <RangePicker key={'datePicker'} onChange={(event) => handleDateChange(event)} style={{ border: '1px solid var(--gray)', marginBottom: '1em' }} />
          <Button key={'search'} icon={<SearchOutlined style={{ color: 'var(--yellow)' }} />}
            onClick={handleSearch} />
        </div>
        <div>
          <Upload
            accept=".xlsx"
            beforeUpload={handleBeforeUpload}
            fileList={fileList}
            onChange={onChange}
            maxCount={1}>
            <Button icon={<UploadOutlined />}>Selecionar Arquivo Excel</Button>
          </Upload>
          <Button type="primary" onClick={handleUpload} style={{ marginTop: 16 }}>
            Enviar Arquivo
          </Button>
        </div>
      </BoxButtons>

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
          <QuestionCircleOutlined style={{ marginBottom: '15em' }}
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
          <QuestionCircleOutlined style={{ marginBottom: '15em' }}
            onClick={() =>
              showModalDoubts('Tempo médio',
                'Neste cartão mostra o tempo médio de contratação geral considerando a hora de abertura e a hora de encerramento, dos cargos.')} />
        </Tooltip>

      </ContainerRowResponsive>

      <LimitedContainer width={1200}>
        <h2>Quantidade de Candidaturas por Cargo</h2>
        <small>Neste gráfico mostra a quantidade de candidaturas feitas for cargo</small>
        <div key={'echarts'} ref={chartRef} style={{ width: '100%', height: '300px', marginBottom: '50px' }} />

        {/* Novo gráfico de custos mensais */}
        <h2>Custos Mensais de Contratação</h2>
        <small>Neste gráfico mostra os custos totais de contratações ao longo dos meses. A linha tracejada é referente a media do custo representada no gráfico</small>
        <div style={{ width: '100%', height: '300px' }} ref={chartRefCosts} />
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