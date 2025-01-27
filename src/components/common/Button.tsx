import { ButtonHTMLAttributes, useMemo } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'dark';
  label: string;
  onClick: () => void;
};

const Button = ({ className, color = 'primary', label, ...props }: Props) => {
  const btnClassName = useMemo(() => {
    const baseClasses = 'rounded-[10px] p-2';
    const colorClasses = {
      primary: 'bg-[#4F46E5] text-white',
      secondary: 'bg-[#16A34A] text-white',
      dark: 'bg-black text-white',
    };
    const classNames = [baseClasses];

    if (className && className.trim().length > 0) {
      classNames.push(className);
    }

    classNames.push(colorClasses[color]);

    return classNames.join(' ');
  }, [className, color]);

  return (
    <button className={btnClassName} {...props}>
      <span className="font-bold text-sm leading-[17px]">{label}</span>
    </button>
  );
};

export default Button;
