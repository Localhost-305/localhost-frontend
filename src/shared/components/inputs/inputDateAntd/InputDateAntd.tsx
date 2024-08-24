import ptBR from 'antd/es/locale/pt_BR';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, ConfigProvider } from 'antd';

import styles from '../input/Input.module.css';

dayjs.extend(customParseFormat);
const dateFormat = 'DD/MM/YYYY';
interface InputDateAntdProps {
    onChange?: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
    label?: string;
    value?: React.ChangeEvent<HTMLInputElement> | null | undefined;
    margin?: string;
    id:string;
    maxDate: string;
    minDate?: string;
}

export interface dateAntd {
  $y: number;
  $D: number;
  $M: number;
}

const InputDateAntd = ({ onChange, label, value, margin, id, maxDate, minDate}: InputDateAntdProps) => {

  const minDateFormat = dayjs(minDate ? minDate : '01/01/2020', dateFormat);
  const maxDateFormat = maxDate == 'today' ? dayjs().add(0, 'day') : dayjs(maxDate, dateFormat);

  return (
    <ConfigProvider locale={ptBR}>
      {label && <label className={styles.label_input}>{label}</label>}
      <DatePicker
        className={styles.input}
        style={{ width: '320px', margin: margin }}
        onChange={onChange}
        value={value}
        format={dateFormat}
        name={id} 
        id={id} 
        disabledDate={(current) => current && (current < minDateFormat || current > maxDateFormat)}/>
    </ConfigProvider>
  );
};

export default InputDateAntd;