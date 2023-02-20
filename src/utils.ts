import { Command } from '@tauri-apps/api/shell';
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
  
  const entries = Object
    .entries(values)
    .map(([key, value]) => [key, isMoment(value) ? value.toDate() : value]);

  return Object.fromEntries(entries);
}

export function datesToMoments(values: any): any {
  if (!values) return values;

  const entries = Object
    .entries(values)
    .map(([key, value]) => [key, (value instanceof Date) ? moment(value) : value]);

  return Object.fromEntries(entries);
}

export function dateDiffInDays(a: Date, b: Date): number {
  if (a == null || b == null) return 0;

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
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function formatCurrency(value: string | number | undefined) {
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? '0';
}

export function clearLocalStorage(startsWith: string) {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;
    if (key.startsWith(startsWith)) keys.push(key);
  }
  keys.forEach(key => localStorage.removeItem(key));
}

export async function getCpuLoad() {
  const command = new Command('wmic', ['cpu', 'get', 'loadpercentage']);
  const response = await command.execute();
  const cpuUsage = response.stdout.replace(/\D/g, '');
  return `CPU Load: ${cpuUsage}%`;
}

export async function getMemoryLoad() {
  const command1 = new Command('wmic', ['ComputerSystem', 'get', 'TotalPhysicalMemory']);
  const command2 = new Command('wmic', ['OS', 'get', 'FreePhysicalMemory']);
  const response1 = await command1.execute();
  const response2 = await command2.execute();

  const totalMemoryInBytes = parseInt(response1.stdout.replace(/\D/g, ''));
  const totalMemoryInGB = (totalMemoryInBytes / 1000000000).toFixed(1);
  const freeMemoryInKB = parseInt(response2.stdout.replace(/\D/g, ''));
  const usedMemoryInBytes = totalMemoryInBytes - (freeMemoryInKB * 1000);
  const usedMemoryInGB = (usedMemoryInBytes / 1000000000).toFixed(1);

  const memoryUsage = Math.round(((usedMemoryInBytes / totalMemoryInBytes) * 100));
  return `Memory Load: ${memoryUsage}% (${usedMemoryInGB}GB dari ${totalMemoryInGB}GB)`;
}

// Don't use. Apparently this function is very heavy and causes CPU usage spikes.
export async function getMemoryUsage() {
  const command = new Command('tasklist');
  const response = await command.execute();
  const result = (/^handalcargo.{53}(.+).{2}$/m).exec(response.stdout);

  if (result && result.length > 1) {
    const memoryUseInKB = parseInt(result[1].trimStart().replace(',', ''));
    const memoryUseInMB = (memoryUseInKB / 1000).toFixed(1);
    return `App Memory Usage: ${memoryUseInMB}MB`;
  }
}

export type Subtract<T extends T1, T1 extends object> = Pick<T, SetComplement<keyof T, keyof T1>>;
export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;
export type SetDifference<A, B> = A extends B ? never : A;
export type RequiredKeys<T> = Pick<T, { [K in keyof T]: {} extends Pick<T, K> ? never : K }[keyof T]>;
