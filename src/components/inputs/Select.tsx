import React from 'react';

function Select({ options, value, onChange }: { options: { value: string, label: string }[], value?: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
    return (
        <select value={value} onChange={onChange} className="bg-solid-primary-dark rounded-lg max-w-[400px] text-solid-primary-light py-1.5 px-1.5 ring-0">
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

export default Select;