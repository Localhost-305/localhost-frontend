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

interface Job {
  job_id: number;                
  job_title: string;             
  number_of_positions: number;   
  job_requirements: string;      
  job_status: string;           
  location: string;              
  responsible_person: string;    
  opening_date: string;          
  closing_date: string;         
  candidates: number;            
}

const DashboardScreen = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
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
    fetch('/jobs.json') 
      .then(response => response.json())
      .then(data => setJobs(data.jobs))
      .catch(error => console.error('Erro ao carregar o JSON:', error));
  }, []);


// GRÁFICO
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || jobs.length === 0) return;

    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const jobNames = jobs.map((job: Job) => job.job_title);  
    const jobCandidates = jobs.map((job: Job) => job.candidates);

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
            color: '#fd7e14'
          }
        }
      ]
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [jobs]);

  return(
      <Screen listBreadcrumb={listBreadcrumb}> 
          {isLoading && <DashboardScreen/>}
          <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
          <BoxButtons>
              <LimitedContainer width={240}>
              </LimitedContainer>
          </BoxButtons>
      </Screen>
  )
};

export default DashboardScreen;

