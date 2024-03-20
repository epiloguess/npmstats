export default function Layout({ children, npm, cnpm }) {
  return (
    <>
      {children}
      <div className="flex gap-2">
        <div className="w-1/2">{cnpm}</div>
        <div className="w-1/2">{npm}</div>
      </div>
    </>
  );
}
