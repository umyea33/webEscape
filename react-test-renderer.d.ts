declare module 'react-test-renderer' {
  import * as React from 'react';

  export type ReactTestRendererJSON =
    | null
    | string
    | {
        type: string;
        props: Record<string, unknown>;
        children: ReactTestRendererJSON[];
      };

  export interface ReactTestInstance {
    type: unknown;
    props: any;
    parent: ReactTestInstance | null;
    children: Array<ReactTestInstance | string>;
    find(predicate: (node: ReactTestInstance) => boolean): ReactTestInstance;
    findByType(type: unknown): ReactTestInstance;
    findByProps(props: Record<string, unknown>): ReactTestInstance;
    findAll(predicate: (node: ReactTestInstance) => boolean, options?: { deep?: boolean }): ReactTestInstance[];
    findAllByType(type: unknown, options?: { deep?: boolean }): ReactTestInstance[];
    findAllByProps(props: Record<string, unknown>, options?: { deep?: boolean }): ReactTestInstance[];
  }

  export interface ReactTestRenderer {
    root: ReactTestInstance;
    toJSON(): ReactTestRendererJSON | ReactTestRendererJSON[];
    toTree(): unknown;
    unmount(): void;
    update(nextElement: React.ReactElement): void;
    getInstance(): unknown;
  }

  export interface TestRendererOptions {
    createNodeMock?: (element: React.ReactElement) => unknown;
  }

  export function create(
    nextElement: React.ReactElement,
    options?: TestRendererOptions,
  ): ReactTestRenderer;

  export function act(callback: () => void): void;
  export function act<T>(callback: () => Promise<T>): Promise<T>;
}
