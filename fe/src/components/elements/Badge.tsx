interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'danger';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    danger: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
