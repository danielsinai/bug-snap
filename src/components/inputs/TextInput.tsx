import React from 'react';

function TextInput({ value, onChange, required }: { value?: string, required?: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <input value={value} onChange={onChange} required={required} className="bg-solid-primary-dark rounded-lg text-solid-primary-light py-1.5 px-1.5 max-w-[400px] ring-0" />
    );
}

export default TextInput;