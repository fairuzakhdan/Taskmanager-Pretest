interface InputProps {
  type?: 'text' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
}

const Input: React.FC<InputProps> = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  rows = 3
}) => {
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500';

  if (type === 'textarea') {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={baseClasses}
      />
    );
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={baseClasses}
    />
  );
};

export default Input;
