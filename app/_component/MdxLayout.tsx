'use client'
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <div className=' prose' style={{ color: "blue" }}>
      {children}
    </div>
  );
}
