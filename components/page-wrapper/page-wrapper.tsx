import { twMerge } from "tailwind-merge";
import Header from "@/components/header";

interface PageWrapperProps {
  className?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function PageWrapper(props: PageWrapperProps) {
  const { children, className, title, subtitle } = props;

  return (
    <div className={twMerge("w-full h-screen mx-auto bg-white", className)}>
      <Header title={title} subtitle={subtitle} />
      <main className="h-[calc(100%-80px)]">{children}</main>
    </div>
  );
}
