declare module 'astro-icon/components' {
  import type { HTMLAttributes } from 'astro/types';

  export interface IconProps extends HTMLAttributes<'svg'> {
    name: string;
    'is:inline'?: boolean;
    title?: string;
    desc?: string;
    size?: number | string;
    width?: number | string;
    height?: number | string;
  }

  // Astro components are functions at type level; `any` keeps the editor quiet
  export const Icon: (props: IconProps) => any;
}

