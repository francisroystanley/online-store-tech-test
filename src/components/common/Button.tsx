import { LoaderCircle } from 'lucide-react';
import { ButtonHTMLAttributes, useMemo } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'dark';
  label: string;
  loading?: boolean;
  onClick: () => void;
};

const Button = ({ className, color = 'primary', disabled, label, loading, ...props }: Props) => {
  const isDisabled = disabled || loading;
  const btnClassName = useMemo(() => {
    const baseClasses = 'flex gap-2 items-center justify-center rounded-[10px] p-2';
    const colorClasses = {
      primary: 'bg-[#4F46E5] text-white',
      secondary: 'bg-[#16A34A] text-white',
      dark: 'bg-black text-white',
    };
    const classNames = [baseClasses];

    if (className && className.trim().length > 0) {
      classNames.push(className);
    }

    if (isDisabled) {
      classNames.push('opacity-50');
    }

    classNames.push(colorClasses[color]);

    return classNames.join(' ');
  }, [className, color, isDisabled]);

  return (
    <button className={btnClassName} disabled={isDisabled} {...props}>
      {loading && <LoaderCircle className="animate-spin" />}
      <span className="font-bold text-sm leading-[17px]">{label}</span>
    </button>
  );
};

export default Button;
