// This declaration allows TypeScript to recognize side-effect imports of non-JS files like CSS.

declare module '*.css' {
  // A simple declaration that importing a CSS file is valid.
  // The value (if any) is generally ignored for global CSS imports.
  const content: any; 
  export default content;
}