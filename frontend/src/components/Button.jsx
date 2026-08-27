import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'dark' | 'outline' | 'secondary' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-hidden disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-full gap-2',
    lg: 'px-7 py-3.5 text-base rounded-full gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-amber-400 text-gray-950 hover:bg-amber-500 shadow-sm hover:shadow-md border border-amber-400/80',
    dark: 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md border border-gray-900',
    outline: 'bg-transparent text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-red-600',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Please wait...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
