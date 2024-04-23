export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <article
      className="
  prose max-w-none
">
      {children}
    </article>
  );
}
