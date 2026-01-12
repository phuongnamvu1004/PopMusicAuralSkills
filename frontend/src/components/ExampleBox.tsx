interface ExampleBoxProps {
  title: string;
  children: React.ReactNode;
}

export function ExampleBox({ title, children }: ExampleBoxProps) {
  return (
    <div className="my-8 p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl shadow-lg border-2 border-sky-200">
      <h4 className="mb-4">{title}</h4>
      {children}
    </div>
  );
}
