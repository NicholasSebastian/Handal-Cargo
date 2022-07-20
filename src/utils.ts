import { ComponentType, FC, Component } from "react";

export function toSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function fromSlug(slug: string) {
  const words = slug.split('-');
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }
  return words.join(' ');
}

export type Subtract<T extends T1, T1 extends object> = Pick<T, SetComplement<keyof T, keyof T1>>;
export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;
export type SetDifference<A, B> = A extends B ? never : A;
