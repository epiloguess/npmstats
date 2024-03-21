export default function Layout({ children, npm, cnpm }) {
  return (
    <>
      {children}
      <div className="md:flex gap-2">
        <div className="md:w-1/2">{cnpm}</div>
        <div className="md:w-1/2">{npm}</div>
      </div>
    </>
  );
}
