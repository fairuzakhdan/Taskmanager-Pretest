import { Label, Input } from '../elements';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  rows
}) => {
  return (
    <>
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
      />
    </>
  );
};

export default FormField;
