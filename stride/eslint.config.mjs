import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({baseDirectory: import.meta.dirname});
const config = [...compat.extends('next/core-web-vitals', 'next/typescript'), {ignores:['out/**','.next/**','next-env.d.ts','node_modules.partial/**','.npm-cache/**']}];
export default config;
