import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h3: ({ children }) => <h3 className=" text-red-400" style={{ fontSize: "100px" }}>{children}</h3>,
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
        alt=""
      />
    ),
    
    ...components,
  };
}
