export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <div
      className="
  prose max-w-none
  prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg
  prose-h3:border-b prose-h3:border-gray-300 prose-h3:my-4 prose-h3:pb-0.5 

  prose-h4:text-teal-600
  prose-h5:text-cyan-600 
  prose-li:marker:text-teal-500 
  prose-code:before:content-[''] prose-code:after:content-[''] 
  prose-a:underline-offset-4 prose-a:decoration-dashed hover:prose-a:text-cyan-500  hover:prose-a:decoration-transparent  prose-a:decoration-cyan-500 prose-a:decoration-2
  prose-blockquote:border-l-4 prose-blockquote:border-rose-500 prose-blockquote:font-normal prose-blockquote:not-italic">
      {children}
    </div>
  );
}
