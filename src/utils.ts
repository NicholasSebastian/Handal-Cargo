import moment, { isMoment } from 'moment';

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

export function isInputElement(element: Element): element is HTMLInputElement | HTMLTextAreaElement {
  return ['input', 'textarea'].includes(element.tagName.toLowerCase())
}

export type Subtract<T extends T1, T1 extends object> = Pick<T, SetComplement<keyof T, keyof T1>>;
export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;
export type SetDifference<A, B> = A extends B ? never : A;
