interface CenterProps {
  children: React.ReactNode;
}

export default function Center(props: CenterProps) {
  const { children } = props;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {children}
    </div>
  );
}
