import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ===================================
// 🎨 UTILITAIRES TAILWIND
// ===================================

/**
 * Combine et merge les classes Tailwind intelligemment
 * @example cn("px-2 py-1", "px-4") → "px-4 py-1"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ===================================
// 📅 UTILITAIRES DATES
// ===================================

/**
 * Formate une date en français
 * @example formatDate(new Date()) → "15 janvier 2025"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/**
 * Formate une heure en français
 * @example formatTime(new Date()) → "19h30"
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
    .format(d)
    .replace(':', 'h');
}

/**
 * Formate date + heure
 * @example formatDateTime(new Date()) → "15 janvier 2025 à 19h30"
 */
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} à ${formatTime(date)}`;
}

/**
 * Retourne le jour de la semaine
 * @example getDayName(new Date()) → "Lundi"
 */
export function getDayName(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(d);
}

/**
 * Vérifie si une date est aujourd'hui
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Vérifie si une date est dans le passé
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}

/**
 * Retourne la différence en jours entre deux dates
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ===================================
// 💰 UTILITAIRES PRIX
// ===================================

/**
 * Formate un prix en euros
 * @example formatPrice(19.99) → "19,99 €"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Calcule un pourcentage
 * @example calculatePercentage(25, 100) → "25%"
 */
export function calculatePercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

// ===================================
// 📧 UTILITAIRES EMAIL
// ===================================

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Masque un email (pour affichage sécurisé)
 * @example maskEmail("jean@example.com") → "j***@example.com"
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  return `${local[0]}${'*'.repeat(local.length - 1)}@${domain}`;
}

// ===================================
// 📱 UTILITAIRES TÉLÉPHONE
// ===================================

/**
 * Valide un numéro de téléphone français
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, '');
  const regex = /^(?:(?:\+|00)33|0)[1-9](?:\d{2}){4}$/;
  return regex.test(cleaned);
}

/**
 * Formate un numéro de téléphone
 * @example formatPhone("0612345678") → "06 12 34 56 78"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '');
  return cleaned.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

/**
 * Masque un téléphone
 * @example maskPhone("0612345678") → "06 ** ** ** 78"
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.length !== 10) return phone;
  return `${cleaned.slice(0, 2)} ** ** ** ${cleaned.slice(-2)}`;
}

// ===================================
// 🎯 UTILITAIRES RÉSERVATIONS
// ===================================

/**
 * Couleur du badge selon le statut
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-green-100 text-green-800 border-green-300',
    seated: 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-gray-100 text-gray-800 border-gray-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    'no-show': 'bg-orange-100 text-orange-800 border-orange-300',
  };
  return colors[status] || colors.pending;
}

/**
 * Label français du statut
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    seated: 'Installés',
    completed: 'Terminée',
    cancelled: 'Annulée',
    'no-show': 'Absent',
  };
  return labels[status] || status;
}

/**
 * Icône emoji du statut
 */
export function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    pending: '⏳',
    confirmed: '✅',
    seated: '🪑',
    completed: '🎉',
    cancelled: '❌',
    'no-show': '👻',
  };
  return icons[status] || '📋';
}

// ===================================
// 👤 UTILITAIRES RÔLES
// ===================================

/**
 * Couleur du badge selon le rôle
 */
export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    manager: 'bg-purple-100 text-purple-800 border-purple-300',
    waiter: 'bg-blue-100 text-blue-800 border-blue-300',
    bartender: 'bg-amber-100 text-amber-800 border-amber-300',
    kitchen: 'bg-orange-100 text-orange-800 border-orange-300',
    host: 'bg-green-100 text-green-800 border-green-300',
  };
  return colors[role] || colors.waiter;
}

/**
 * Label français du rôle
 */
export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    manager: 'Gérant',
    waiter: 'Serveur',
    bartender: 'Barman',
    kitchen: 'Cuisine',
    host: "Hôte d'accueil",
  };
  return labels[role] || role;
}

/**
 * Icône emoji du rôle
 */
export function getRoleIcon(role: string): string {
  const icons: Record<string, string> = {
    manager: '👨‍💼',
    waiter: '👨‍🍳',
    bartender: '🍹',
    kitchen: '👨‍🍳',
    host: '👋',
  };
  return icons[role] || '👤';
}

// ===================================
// 🔤 UTILITAIRES TEXTE
// ===================================

/**
 * Capitalize première lettre
 * @example capitalize("bonjour") → "Bonjour"
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Tronque un texte
 * @example truncate("Un long texte...", 10) → "Un long..."
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Slug (URL-friendly)
 * @example slugify("Menu du Jour") → "menu-du-jour"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Initiales d'un nom
 * @example getInitials("Jean Dupont") → "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ===================================
// 🎲 UTILITAIRES DIVERS
// ===================================

/**
 * Génère un ID unique
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Attend X millisecondes (pour tests/demos)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Copie dans le presse-papier
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Télécharge un fichier
 */
export function downloadFile(data: string, filename: string, type: string): void {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Formate un nombre avec séparateurs
 * @example formatNumber(1234567) → "1 234 567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

/**
 * Débouncé (limite appels de fonction)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle (limite fréquence d'appels)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===================================
// 🎨 UTILITAIRES COULEURS
// ===================================

/**
 * Convertit HEX en RGB
 * @example hexToRgb("#ff0000") → "rgb(255, 0, 0)"
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
}

/**
 * Génère une couleur aléatoire
 */
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
}
