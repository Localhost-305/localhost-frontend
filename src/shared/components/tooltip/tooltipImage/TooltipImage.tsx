import styles from "./TooltipImage.module.css";
import Tooltip from "../tooltip/Tooltip";
import { SerializedItemsType } from "../../../types/SerializedItemsType";


interface TooltipImageProps {
    item: SerializedItemsType
}

const TooltipImage = ({item}: TooltipImageProps) => {
    let image: string = '../../../../../public/fundo-sem-imagem.png'
    if(item.product.image_hyperlink){
        image = item.product.image_hyperlink;
    }

    return (
        <Tooltip tooltip={<img className={styles.image} src={image} style={{alignItems: 'initial'}}/>}>
            <span style={{cursor: 'pointer'}}>{item.product.description}</span>
        </Tooltip>
    )
}

export default TooltipImage;