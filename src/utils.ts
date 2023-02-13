import moment, { isMoment } from 'moment';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// This file holds a collection of random utility functions.

export function toSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function fromSlug(slug: string) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function momentsToDates(values: any): any {
  if (!values) return values;
  return Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => [key, isMoment(value) ? value.toDate() : value]));
}

export function datesToMoments(values: any): any {
  if (!values) return values;
  return Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => [key, (value instanceof Date) ? moment(value) : value]));
}

export function dateDiffInDays(a: Date, b: Date): number {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc1 - utc2) / MS_PER_DAY);
}

export function isInputElement(element: Element): element is HTMLInputElement | HTMLTextAreaElement {
  return ['input', 'textarea'].includes(element.tagName.toLowerCase())
}

export function dateToString(date: Date) {
  if (!date) return undefined;
  return date.toLocaleDateString("id-ID", { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatCurrency(value: string | number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function clearLocalStorage(startsWith: string) {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;
    if (key.startsWith(startsWith)) keys.push(key);
  }
  keys.forEach(key => localStorage.removeItem(key));
}

export type Subtract<T extends T1, T1 extends object> = Pick<T, SetComplement<keyof T, keyof T1>>;
export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;
export type SetDifference<A, B> = A extends B ? never : A;
export type RequiredKeys<T> = Pick<T, { [K in keyof T]: {} extends Pick<T, K> ? never : K }[keyof T]>;
