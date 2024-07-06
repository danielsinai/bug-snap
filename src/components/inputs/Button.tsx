import React from 'react';

const variants: Record<string, string> = {
    'primary': 'bg-solid-primary-dark text-solid-primary-light hover:opacity-70',
}
const base = 'py-3 px-8 rounded-lg w-[100px]';

function Button({ name, onClick, variant = 'primary', type }: { type?: 'submit'; name?: string, onClick?: React.MouseEventHandler<HTMLButtonElement>, variant?: string }) {

    return (
        <button type={type ?? 'button'} title={name} value={name} name={name} onClick={onClick} className={`${base} ${variants[variant]}`}>
            {name}
        </button>
    );
}

export default Button;