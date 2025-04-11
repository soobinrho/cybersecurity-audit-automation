export default function InlineCode({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <code className="px-2 py-1 font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
      {children}
    </code>
  );
}
