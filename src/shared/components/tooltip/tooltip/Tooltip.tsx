import { Tooltip as TooltipAntd } from 'antd';

import styles from './Tooltip.module.css';

interface TooltipProps{
    children: React.ReactNode;
    tooltip?: React.ReactNode;
    title?: string;

}

const Tooltip = ({children, tooltip, title}: TooltipProps) => {
    if(title){
        <TooltipAntd title={title}>
            {children}
        </TooltipAntd>
    }

    return (
        <div className={styles.container_tooltip}>
            <div className={styles.container_tooltip_external}>
                {tooltip}
            </div>
            {children}
        </div>

    )

}

export default Tooltip;