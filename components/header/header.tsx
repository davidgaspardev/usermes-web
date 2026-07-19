import { twMerge } from "tailwind-merge";

interface HeaderProps {
  className?: string;
  options?: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function Header(props: HeaderProps) {
  const { title, className, options, subtitle } = props;

  return (
    <header className={twMerge("w-full h-20 px-4", className)}>
      <div className="w-full h-full border-b border-gray-200 flex flex-row items-center justify-between">
        <div>
          <h1 className="text-black font-bold text-2xl">{title}</h1>
          {subtitle && <h2 className="text-gray-500">{subtitle}</h2>}
        </div>
        {options && <div>{options}</div>}
      </div>
    </header>
  );
}
