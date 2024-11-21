import React, { useState } from 'react';
import { Textfield } from '../assets/css/textfield';

interface HourPickerProps {
    value?: string; // The initial value (optional)
    onChange?: (value: string) => void; // Callback to handle value change
    placeholder?: string; // Optional placeholder prop
}

const HourPicker: React.FC<HourPickerProps> = ({ value = '', onChange, placeholder = '' }) => {
    const [inputValue, setInputValue] = useState<string>(value);

    // Handle input change and enforce numeric input
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        // Only allow numeric characters, and format it as HH:mm
        const numericValue = value.replace(/[^\d]/g, ''); // Remove non-numeric characters
        let formattedValue = numericValue;

        if (formattedValue.length >= 3) {
            formattedValue = `${formattedValue.slice(0, 2)}:${formattedValue.slice(2, 4)}`;
        } else if (formattedValue.length >= 2) {
            formattedValue = `${formattedValue.slice(0, 2)}:${formattedValue.slice(2)}`;
        }

        // Ensure hour and minute are within valid ranges
        if (formattedValue.length >= 5) {
            const [hour, minute] = formattedValue.split(':');
            if (parseInt(hour) > 23) {
                formattedValue = `23:${minute}`;
            } else if (parseInt(minute) > 59) {
                formattedValue = `${hour}:59`;
            }
        }

        setInputValue(formattedValue);
        if (onChange) {
            onChange(formattedValue);
        }
    };

    return (
        <Textfield
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            maxLength={5}
            placeholder={placeholder}
            pattern="([0-1]?[0-9]|2[0-3]):([0-5][0-9])"
        />
    );
};

export default HourPicker;
