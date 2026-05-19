// src/types/dashboard.ts

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'other';

export interface InstallmentData {
  totalAmount: number;
  count: number;
  bank: string;
  brand: CardBrand; // Agregado
}

export interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  source: string; 
  categoryId: string;
  isInstallment?: boolean;
  installmentData?: InstallmentData;
  currentInstallment?: number; 
}

export interface IncomeSource {
  id: number;
  date: string; 
  desc: string;
  amount: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'necesidad' | 'deseo' | 'ahorro';
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'super', name: '🛒 Supermercado', type: 'necesidad', color: '#3b82f6' },
  { id: 'vivienda', name: '🏠 Vivienda/Servicios', type: 'necesidad', color: '#0ea5e9' },
  { id: 'transporte', name: '🚗 Transporte', type: 'necesidad', color: '#6366f1' },
  { id: 'salud', name: '💊 Salud', type: 'necesidad', color: '#ec4899' },
  { id: 'comida', name: '🍕 Delivery/Salidas', type: 'deseo', color: '#8b5cf6' },
  { id: 'ocio', name: '🍿 Ocio/Streaming', type: 'deseo', color: '#a855f7' },
  { id: 'compras', name: '🛍️ Ropa/Varios', type: 'deseo', color: '#d946ef' },
  { id: 'educacion', name: '🎓 Educación', type: 'necesidad', color: '#14b8a6' },
  { id: 'electro', name: '📺 Electro/Hogar', type: 'deseo', color: '#f59e0b' },
  { id: 'otros', name: '📦 Otros', type: 'deseo', color: '#94a3b8' },
];