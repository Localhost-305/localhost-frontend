import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { Button, DatePicker, TableColumnsType, Tooltip, Modal, Upload } from 'antd';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { QuestionCircleOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import axios from "axios";

import '../../../shared/components/styles/customTooltip.css';
import styles from '../styles/DashboardScreen.module.css'
import Screen from "../../../shared/components/screen/Screen";
import FirstScreen from '../../firstScreen';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { LimitedContainer } from "../../../shared/components/styles/limited.styled";
import { useLoading } from "../../../shared/components/loadingProvider/LoadingProvider";
import { JobsType } from '../../../shared/types/JobsType';
import { CandidatesType } from '../../../shared/types/CandidatesType';
import { CandidateType } from '../../../shared/types/CandidateType';
import { MethodsEnum } from '../../../shared/enums/methods.enum';
import { useRequests } from '../../../shared/hooks/useRequests';
import { URL_AMOUNT, URL_APPLICATIONS, URL_HIRING, URL_JOB, URL_QUANTITYAPPLICATIONS } from '../../../shared/constants/urls';
import { StyledCard } from "../../dashboard/styles/Dashboard.style"
import { useGlobalReducer } from '../../../store/reducers/globalReducer/useGlobalReducer';
import { NotificationEnum } from '../../../shared/types/NotificationType';
import { ContainerRowResponsive } from '../../../shared/components/styles/containerRowResponsive.style';
import { ResponsiveTable } from '../../../shared/components/styles/tableResponsive.style';
import { JobAverageAllType } from '../../../shared/types/JobAverageAllType';
import { BoxButtons } from '../../../shared/components/styles/boxButtons.style';
import { getItemStorage } from '../../../shared/functions/connection/storageProxy';
import { AUTHORIZARION_KEY, PERMISSIONS } from '../../../shared/constants/authorizationConstants';
import { HiringCostType } from '../../../shared/types/HiringCostType';
import { AmountCollectedType } from '../../../shared/types/AmountCollectedType';
import { convertNumberToMoney } from '../../../shared/functions/utils/money';
import { ScrollableDiv } from '../../../shared/components/styles/scrollableDiv.style';
import { HistApplicationType } from '../../../shared/types/HistApplicationType';
import { CloseOutlined } from '@ant-design/icons'; 
import { HiringRetentionType } from '../../../shared/types/HiringRetentionType';

// BREADCRUMB
const listBreadcrumb = [ { name: 'Home'} ]

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

// VARIABLES
const dateFormat = 'DD/MM/YYYY';

const DashboardScreen = () => {
  const { request } = useRequests();
  const { setNotification } = useGlobalReducer();
  const { isLoading, setLoading } = useLoading();
  const [monthlyCosts, setMonthlyCosts] = useState<HiringCostType[]>([]);
  const [jobs, setJobs] = useState<JobsType[]>([]);
  const [candidates, setCandidates] = useState<CandidatesType[]>([]);
  const [candidate, setCandidate] = useState<CandidateType[]>([]);
  const [jobsAverageAll, setJobsAverageAll] = useState<JobAverageAllType[]>([]);
  const [startDateStr, setStartDateStr] = useState<Dayjs | null>(null);
  const [endDateStr, setEndDateStr] = useState<Dayjs | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [retentions, setRetentions] = useState<HiringRetentionType>();

  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [options, setOptions] = useState<SelectProps['options']>([]);
  const [histApplication, setHistApplication] = useState<HistApplicationType[]>([]);
  const [analysisDepth, setAnalysisDepth] = useState<number>(6);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [amountCollected, setAmountCollected] = useState<AmountCollectedType[]>([]);
  const [selectedMonths, setSelectedMonths] = useState(3);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const handleMonthsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonths(Number(event.target.value));
  };

  let permissions = getItemStorage(PERMISSIONS);
  if(permissions?.includes('allowed_to_see')){

  }

  // ECHARTS
  const chartRefHist = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartRefCosts = useRef<HTMLDivElement>(null);
  const chartRefLine = useRef<HTMLDivElement>(null);


  const filteredJobs = selectedJob
    ? jobs.filter((job: JobsType) => job.JobTitle === selectedJob)
    : jobs;

  // EVENTS
  useEffect(() => {
    setLoading(true);
    try {
      request(`${URL_APPLICATIONS}/jobs`, MethodsEnum.GET, setCandidates);
      request(`${URL_HIRING}/retention`, MethodsEnum.GET, setRetentions);
      request(`${URL_APPLICATIONS}/candidate`, MethodsEnum.GET, setCandidate);
      request(`${URL_JOB}/jobAverage`, MethodsEnum.GET, setJobs);
      request(`${URL_JOB}/jobAverageAll`, MethodsEnum.GET, setJobsAverageAll);
      request(`${URL_HIRING}/cost?startDate=${startDateStr ? startDateStr : "2000-01-01"}&endDate=${endDateStr ? endDateStr : "3000-01-01"}`, MethodsEnum.GET, setMonthlyCosts);
      request(`${URL_AMOUNT}/collected?months=${selectedMonths}`, MethodsEnum.GET, setAmountCollected);
      request(`${URL_QUANTITYAPPLICATIONS}/collected?months=${analysisDepth}`, MethodsEnum.GET, setHistApplication);
      request(`${URL_APPLICATIONS}/candidate`, MethodsEnum.GET, (data: CandidateType[]) => {
        setCandidate(data);
        const jobOptions = data.map((item: CandidateType) => ({
          value: item.jobTitle,
          label: item.jobTitle
        }));
        setOptions(jobOptions);
      });
      request(`${URL_APPLICATIONS}/candidate`, MethodsEnum.GET, (data: CandidateType[]) => {
        setCandidate(data);
          const jobOptions = data.map((item: CandidateType) => ({
            value: item.jobTitle,
            label: item.jobTitle
          }));
          setOptions(jobOptions);
        });

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);

    } catch (error) {
      setNotification(String(error), NotificationEnum.ERROR);
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current || jobs.length === 0) return;

    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const dataToUse = selectedJob
      ? candidates.filter((candidate: CandidatesType) => candidate.jobTitle === selectedJob)
      : candidates;

    if (dataToUse.length > 0) {
      const jobNames = dataToUse.map((job: CandidatesType) => job.jobTitle);
      const candidateCount = dataToUse.map((job: CandidatesType) => job.count);

      const option: EChartOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%', 
          top: '10%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: jobNames,
          axisTick: { alignWithLabel: true },
          axisLabel: { show: true, rotate: 30 }
        }],
        yAxis: [{ type: 'value' }],
        series: [{
          name: 'Candidatos',
          type: 'bar',
          barWidth: '60%',
          barCategoryGap: '20%',
          data: candidateCount,
          itemStyle: {
            color: '#007BFF',
            barBorderRadius: [8, 8, 0, 0]
          },
        }]
      };
      
      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, [jobs, selectedJob, candidates]);

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
            formatter: (value: number) => { return convertNumberToMoney(value) }
          }
        }
      ],
      series: [
        {
          name: 'Custo Total',
          type: 'bar',
          barWidth: '60%',
          data: totalCosts,
          markLine: {
            data: [{ yAxis: averageCost, name: `Avg (R$ ${formattedAverageCost})` }]
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params: { value: number }) => convertNumberToMoney(params.value)
          }
        }
      ]
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [monthlyCosts]);

  useEffect(() => {
    const fetchData = async () => {
        try {

            const token = localStorage.getItem('AUTHORIZARION_KEY');

            const url = selectedJob
                ? `http://localhost:9090/amount/collected?months=${selectedMonths}&profession=${selectedJob}`
                : `http://localhost:9090/amount/collected?months=${selectedMonths}`;

            const response = await fetch(url, {
              method: 'GET', 
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '', 
              },
            });

            if (!response.ok) throw new Error('Erro na requisição');
            const data: AmountCollectedType[] = await response.json();

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;

            const historicalData = data
                .filter((item) => item.year < currentDate.getFullYear() || (item.year === currentDate.getFullYear() && item.month < currentMonth))
                .map((item) => [`${String(item.month).padStart(2, '0')}-${item.year}`, item.collectedRevenue]);

            const forecastData = data
                .filter((item) => (item.year === currentDate.getFullYear() && item.month >= currentMonth) || (item.year > currentDate.getFullYear()))
                .map((item) => [`${String(item.month).padStart(2, '0')}-${item.year}`, item.collectedRevenue]);

            const myChart = echarts.init(chartRefLine.current);
            const option: EChartOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'cross' }
                },
                legend: {
                    data: ['Histórico', 'Previsão'],
                    bottom: '0',
                    textStyle: { fontSize: 12 }
                },
                xAxis: {
                    type: 'category',
                    name: 'Mês-Ano',
                    splitLine: { lineStyle: { type: 'dashed' } },
                    axisLabel: { show: true }
                },
                yAxis: {
                    type: 'value',
                    name: 'Custo (R$)',
                    splitLine: { lineStyle: { type: 'dashed' } },
                    axisLabel: {
                        formatter: (value: number | bigint) => new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(value)
                    }
                },
                series: [
                    { name: 'Histórico', type: 'line', symbolSize: 7, symbol: 'circle', itemStyle: { color: 'blue' }, data: historicalData },
                    { name: 'Previsão', type: 'line', smooth: true, symbolSize: 7, symbol: 'circle', itemStyle: { color: 'orange' }, data: forecastData }
                ]
            };

            myChart.setOption(option);

            return () => {
                myChart.dispose();
            };
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    fetchData();
  }, [selectedMonths, selectedJob]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const token = localStorage.getItem('AUTHORIZARION_KEY');

        const url = selectedJob
        ? `http://localhost:9090/quantityApplications/collected?months=${analysisDepth}&profession=${selectedJob}`
        : `http://localhost:9090/quantityApplications/collected?months=${analysisDepth}`;

      const response = await fetch(url, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '', // Inclui o token no cabeçalho
        },
      });

      if (!response.ok) throw new Error('Erro na requisição');
      const data: HistApplicationType[] = await response.json();
      console.log(data);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;

        const historicalData = data
          .filter((item) => item.year < currentDate.getFullYear() || (item.year === currentDate.getFullYear() && item.month <= currentMonth))
          .map((item) => [`${String(item.month).padStart(2, '0')}-${item.year}`, item.quantityApplications]);

        const forecastData = data
          .filter((item) => (item.year === currentDate.getFullYear() && item.month > currentMonth) || (item.year > currentDate.getFullYear()))
          .map((item) => [`${String(item.month).padStart(2, '0')}-${item.year}`, item.quantityApplications]);

        const chart = echarts.init(chartRefHist.current);
        const option: EChartOption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' },
          },
          legend: {
            data: ['Histórico', 'Previsão'],
            bottom: '0',
            textStyle: { fontSize: 12 }
          },
          xAxis: {
            type: 'category',
            name: 'Mês-Ano',
            data: data.map(item => `${String(item.month).padStart(2, '0')}-${item.year}`),
            splitLine: { lineStyle: { type: 'dashed' } }
          },
          yAxis: {
            type: 'value',
            name: 'Candidaturas',
            splitLine: { lineStyle: { type: 'dashed' } }
          },
          series: [
            {
              name: 'Histórico',
              type: 'line',
              symbolSize: 7,
              symbol: 'circle',
              itemStyle: { color: 'blue' },
              data: historicalData,
              label: {
                show: true,
                position: 'top',
                fontSize: 13.5,
                color: 'blue',
              }
            },
            {
              name: 'Previsão',
              type: 'scatter',
              symbolSize: 10,
              itemStyle: { color: 'red' },
              data: forecastData,
              label: {
                show: true,
                position: 'top',
                fontSize: 13.5,
                color: 'red',
              }
            }
          ]
        };

        chart.setOption(option);

        return () => {
          chart.dispose();
        };
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [analysisDepth, histApplication, selectedJob]);

  useEffect(() => {
    setLoading(true);
    try {
      request(`${URL_QUANTITYAPPLICATIONS}/collected?months=${analysisDepth}`, MethodsEnum.GET, setHistApplication);
    } catch (error) {
      setNotification(String(error), NotificationEnum.ERROR);
    } finally {
      setLoading(false)
    }
  }, [analysisDepth]);

  // UTILS
  dayjs.extend(customParseFormat);

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDateStr(date);
  }

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDateStr(date);
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
      request(`${URL_HIRING}/retention?startDateStr=${startDateStr.format('YYYY-MM-DD')}&endDateStr=${endDateStr.format('YYYY-MM-DD')}`,
        MethodsEnum.GET,
        setRetentions);
      request(`${URL_HIRING}/cost?startDate=${startDateStr.format('YYYY-MM-DD')}&endDate=${endDateStr.format('YYYY-MM-DD')}`,
        MethodsEnum.GET,
        setMonthlyCosts);
    } else {
      try {
        request(`${URL_APPLICATIONS}/jobs`, MethodsEnum.GET, setCandidates);
        request(`${URL_HIRING}/retention`, MethodsEnum.GET, setRetentions);
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

  const handleJobChangeReset = (value: string | null) => {
    setSelectedJob(null);
  };

  const handleJobChange = (value: string | null) => {
    setSelectedJob(value);
    const filteredCandidate = candidate.filter((candidate) => candidate.jobTitle === value);
    setCandidate(filteredCandidate);
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
    setFileList(info.fileList.slice(-1));
  };

  const handleAnalysisDepth = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAnalysisDepth(Number(event.target.value));
  }

  // EXCEL
  const handleBeforeUpload = (file: File) => {
    const isExcel = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) setNotification("Você só pode enviar arquivos .xlsx!", NotificationEnum.ERROR);

    return isExcel || Upload.LIST_IGNORE;
  };

  // MODAL DOUBTS
  const [isModalDoubtsOpen, setIsModalDoubtsOpen] = useState(false);
  const [contentDoubt, setContentDoubt] = useState<String>('');
  const [titleDoubt, setTitleDoubt] = useState<String>('');

  const showModalDoubts = (title: string, content: string) => {
    setTitleDoubt(title);
    setContentDoubt(content);
    setIsModalDoubtsOpen(true);
  }

  return (
    <Screen listBreadcrumb={listBreadcrumb}>
      {isLoading && <FirstScreen />}
      <h1>Dashboard dos Dados de Contratação</h1>
      <BoxButtons>
        <div>
          <DatePicker 
            format={dateFormat}
            key={'startDate'} 
            onChange={handleStartDateChange} 
            placeholder="Data Inicial" 
            style={{ marginRight: '5px' }} 
          />
          <DatePicker 
            format={dateFormat}
            key={'endDate'} 
            onChange={handleEndDateChange} 
            placeholder="Data Final" 
            style={{ marginRight: '5px' }} 
          />
          <Button key={'search'} icon={<SearchOutlined style={{ color: 'var(--yellow)' }} />}
            onClick={handleSearch} />
        </div>
        <div>
          <Select
            defaultValue={null}
            onChange={handleJobChange}
            style={{ width: 200 }}
            options={options}
            placeholder="Selecione uma vaga"
          />
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
        </div>
        <div>
          <Button type="primary" onClick={handleUpload}>
            Enviar Arquivo
          </Button>
        </div>
      </BoxButtons>
      <ContainerRowResponsive maxWidth={'800px'}>
        <ResponsiveTable
          columns={columns as any}
          className="table-responsive"
          dataSource={filteredJobs}
          bordered
          pagination={{ pageSize: 5 }}
          rowKey={(doc: any) => doc.JobTitle}
          components={{
            header: {
              cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
                <th {...props} style={{ backgroundColor: 'var(--orange)', color: 'var(--white)' }}>
                  {props.children}
                </th>
              ),
            },
          }}
        />
        <Tooltip title="Tempo médio de contratação por cargo" overlayClassName="custom-tooltip">
          <QuestionCircleOutlined style={{ marginBottom: window.innerWidth < 768 ? '1em' : '15em' }}
            onClick={() =>
              showModalDoubts('Tempo médio de contratação por cargo',
                'Nesta tabela mostra o tempo médio de contratação por vaga considerando a hora de abertura e a hora de encerramento, dos cargos.')} />
        </Tooltip>
        <StyledCard bordered>
          <div className="card-bg"></div>
          <h1 className="card-title">Tempo Médio Total</h1>
          <h2 className="card-date"><span>{jobsAverageAll.length > 0 ? jobsAverageAll[0].AverageTime : 0} Horas</span></h2>
        </StyledCard>
        <Tooltip title="Tempo médio de contratação" overlayClassName="custom-tooltip">
          <QuestionCircleOutlined style={{ marginBottom: window.innerWidth < 768 ? '3em' : '15em' }}
            onClick={() =>
              showModalDoubts('Tempo médio total',
                'Neste cartão mostra o tempo médio de contratação geral considerando a hora de abertura e a hora de encerramento, dos cargos. Filtro de vaga não é aplicado ao Cartão. ')} />
        </Tooltip>
        <StyledCard bordered>
          <div className="card-bg"></div>
          <h1 className="card-title">Retenção Média</h1>
          <h2 className="card-date">
            <span>{retentions ? `${retentions.retentionDays} dias` : '0 dias'}</span>
          </h2>
          </StyledCard>
        <Tooltip title="Retenção Média" overlayClassName="custom-tooltip">
          <QuestionCircleOutlined style={{ marginBottom: window.innerWidth < 768 ? '3em' : '15em' }}
            onClick={() =>
              showModalDoubts('Retenção Média',
                'Neste cartão mostra a retenção média. ')} />
        </Tooltip>
      </ContainerRowResponsive>
      <LimitedContainer width={1200}>
        <h2>Quantidade de Candidaturas por Cargo</h2>
        <small>Neste gráfico mostra a quantidade de candidaturas feitas for cargo</small>
        <ScrollableDiv>
          <div key={'echarts'} ref={chartRef} className={styles.echartsContainer} style={{ height: '400px', marginBottom: '50px' }} />
        </ScrollableDiv>
        <ScrollableDiv>
          <h2>Custos Mensais de Contratação</h2>
          <small>Neste gráfico mostra os custos totais de contratações ao longo dos meses. A linha tracejada é referente a media do custo representada no gráfico</small>
          <div style={{ width: '100%', height: '300px', marginBottom: '50px' }} ref={chartRefCosts} />
        </ScrollableDiv>
        <ScrollableDiv>
          <h2>Previsão e Histórico de Custos</h2>
          <small>Neste gráfico mostra o histórico e a previsão dos custos</small>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <select
              value={selectedMonths}
              onChange={handleMonthsChange}
              style={{
                  padding: '6px 12px',
                  borderRadius: '8px', 
                  border: '1px solid #ccc', 
                  outline: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: '#f9f9f9',
                  marginRight: '5px' 
              }}
            >
              <option value="3">3 meses</option>
              <option value="6">6 meses</option>
              <option value="9">9 meses</option>
              <option value="12">12 meses</option>
              <option value="24">24 meses</option>
            </select>
            <Select
              value={selectedJob} 
              onChange={handleJobChange} 
              style={{ width: 200, marginRight: '5px' }}
              options={options}
              placeholder="Selecione uma vaga"
            />
            <button
              onClick={() => handleJobChangeReset(null)}
              style={{
                backgroundColor: '#FFCCCC',
                border: 'none', 
                color: 'red', 
                fontSize: '10px', 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                padding: '3px 5px', 
                transition: 'color 0.3s ease', 
              }}
            >
              <CloseOutlined style={{ fontSize: '18px' }} /> 
            </button>
          </div>
          <div style={{ width: '100%', height: '300px' }} ref={chartRefLine} />
        </ScrollableDiv>
        <ScrollableDiv>
          <h2>Histórico de Candidaturas e Previsão</h2>
          <small>
            Este gráfico exibe o histórico de candidaturas em azul e a previsão dos próximos meses em vermelho.
            A linha de previsão é calculada com base nos dados históricos usando uma regressão exponencial.
          </small>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <label htmlFor="analysisDepth" style={{ marginRight: '8px' }}>Profundidade de Análise:</label>
            <select
              id="analysisDepth"
              value={analysisDepth}
              onChange={(event) => handleAnalysisDepth(event)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px', 
                border: '1px solid #ccc', 
                outline: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9' 
              }}>
              <option value={3}>3 meses</option>
              <option value={6}>6 meses</option>
              <option value={12}>12 meses</option>
              <option value={24}>24 meses</option>
            </select>
            <Select
              value={selectedJob}
              onChange={handleJobChange}
              style={{ width: 200 }}
              options={options}
              placeholder="Selecione uma vaga"
            />
            {/* <button onClick={() => handleJobChangeReset(null)}>X</button> */}
            <button
              onClick={() => handleJobChangeReset(null)}
              style={{
                backgroundColor: '#FFCCCC',
                border: 'none', 
                color: 'red', 
                fontSize: '10px', 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                padding: '3px 5px', 
                transition: 'color 0.3s ease', 
              }}
            >
              <CloseOutlined style={{ fontSize: '18px' }} /> 
            </button>
          </div>

          <div style={{ width: '100%', height: '400px' }} ref={chartRefHist} />
        </ScrollableDiv>
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