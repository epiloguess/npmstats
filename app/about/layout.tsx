export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <article
      className=" font-sans 
  prose  max-w-none prose-code:before:content-[''] prose-code:after:content-[''] 
">
      {children}
    </article>
  );
}
