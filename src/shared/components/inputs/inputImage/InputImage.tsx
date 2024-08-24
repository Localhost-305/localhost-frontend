import React, { useState } from 'react';
import styles from './InputImage.module.css';

export interface InputImageProps {
    label: string;
    id: string;
    onChange?: (images: File[]) => void;
    margin?: string;
}

const InputImage = ({ label, id, onChange, margin }: InputImageProps) => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).slice(0, 6 - selectedImages.length);
            const updatedImages = [...selectedImages, ...newImages];
            setSelectedImages(updatedImages);
            if (onChange) onChange(updatedImages);
        }
    };

    return (
        <div className={styles.div_input} style={{ margin }}>
            <label className={styles.label_input}>{label}</label>
            <input
                className={styles.input}
                type="file"
                id={id}
                multiple
                accept="image/*"
                onChange={handleImageChange}
            />
            <label htmlFor={id} className={styles.custom_file_input}>
                Selecione Imagens
            </label>
            <div className={styles.image_preview}>
                {selectedImages.map((image, index) => (
                    <div key={index} className={styles.image_card}>
                        <img src={URL.createObjectURL(image)} alt={`Imagem ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InputImage;