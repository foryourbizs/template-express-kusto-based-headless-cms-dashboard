import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * LocalStorage CRUD 유틸리티
 */
export class LocalStorage {
	// Create/Update
	static set<T = any>(key: string, value: T): void {
		try {
			const serialized = JSON.stringify(value);
			localStorage.setItem(key, serialized);
		} catch (error) {
			console.error(`LocalStorage set error for key "${key}":`, error);
		}
	}

	// Read
	static get<T = any>(key: string, defaultValue?: T): T | null {
		try {
			const item = localStorage.getItem(key);
			if (item === null) return defaultValue ?? null;
			return JSON.parse(item) as T;
		} catch (error) {
			console.error(`LocalStorage get error for key "${key}":`, error);
			return defaultValue ?? null;
		}
	}

	// Delete
	static remove(key: string): void {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error(`LocalStorage remove error for key "${key}":`, error);
		}
	}

	// Clear all
	static clear(): void {
		try {
			localStorage.clear();
		} catch (error) {
			console.error('LocalStorage clear error:', error);
		}
	}

	// Check if key exists
	static has(key: string): boolean {
		return localStorage.getItem(key) !== null;
	}

	// Get all keys
	static keys(): string[] {
		return Object.keys(localStorage);
	}
}

/**
 * SessionStorage CRUD 유틸리티
 */
export class SessionStorage {
	// Create/Update
	static set<T = any>(key: string, value: T): void {
		try {
			const serialized = JSON.stringify(value);
			sessionStorage.setItem(key, serialized);
		} catch (error) {
			console.error(`SessionStorage set error for key "${key}":`, error);
		}
	}

	// Read
	static get<T = any>(key: string, defaultValue?: T): T | null {
		try {
			const item = sessionStorage.getItem(key);
			if (item === null) return defaultValue ?? null;
			return JSON.parse(item) as T;
		} catch (error) {
			console.error(`SessionStorage get error for key "${key}":`, error);
			return defaultValue ?? null;
		}
	}

	// Delete
	static remove(key: string): void {
		try {
			sessionStorage.removeItem(key);
		} catch (error) {
			console.error(`SessionStorage remove error for key "${key}":`, error);
		}
	}

	// Clear all
	static clear(): void {
		try {
			sessionStorage.clear();
		} catch (error) {
			console.error('SessionStorage clear error:', error);
		}
	}

	// Check if key exists
	static has(key: string): boolean {
		return sessionStorage.getItem(key) !== null;
	}

	// Get all keys
	static keys(): string[] {
		return Object.keys(sessionStorage);
	}
}

/**
 * Cookie CRUD 유틸리티
 */
export interface CookieOptions {
	expires?: number | Date; // 만료 시간 (일수 또는 Date 객체)
	path?: string;           // 쿠키 경로
	domain?: string;         // 쿠키 도메인
	secure?: boolean;        // HTTPS only
	sameSite?: 'strict' | 'lax' | 'none'; // SameSite 속성
}

export class Cookie {
	// Create/Update
	static set(key: string, value: string, options: CookieOptions = {}): void {
		try {
			let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

			// 만료 시간 설정
			if (options.expires) {
				let expiresDate: Date;
				if (typeof options.expires === 'number') {
					expiresDate = new Date();
					expiresDate.setTime(expiresDate.getTime() + options.expires * 24 * 60 * 60 * 1000);
				} else {
					expiresDate = options.expires;
				}
				cookieString += `; expires=${expiresDate.toUTCString()}`;
			}

			// 경로 설정 (기본값: '/')
			cookieString += `; path=${options.path || '/'}`;

			// 도메인 설정
			if (options.domain) {
				cookieString += `; domain=${options.domain}`;
			}

			// Secure 설정
			if (options.secure) {
				cookieString += '; secure';
			}

			// SameSite 설정
			if (options.sameSite) {
				cookieString += `; samesite=${options.sameSite}`;
			}

			document.cookie = cookieString;
		} catch (error) {
			console.error(`Cookie set error for key "${key}":`, error);
		}
	}

	// Read
	static get(key: string): string | null {
		try {
			const nameEQ = encodeURIComponent(key) + '=';
			const cookies = document.cookie.split(';');
			
			for (let cookie of cookies) {
				cookie = cookie.trim();
				if (cookie.startsWith(nameEQ)) {
					return decodeURIComponent(cookie.substring(nameEQ.length));
				}
			}
			return null;
		} catch (error) {
			console.error(`Cookie get error for key "${key}":`, error);
			return null;
		}
	}

	// Delete
	static remove(key: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
		try {
			this.set(key, '', {
				...options,
				expires: new Date(0), // 과거 날짜로 설정하여 삭제
			});
		} catch (error) {
			console.error(`Cookie remove error for key "${key}":`, error);
		}
	}

	// Check if key exists
	static has(key: string): boolean {
		return this.get(key) !== null;
	}

	// Get all cookies as object
	static getAll(): Record<string, string> {
		try {
			const cookies: Record<string, string> = {};
			const cookieArray = document.cookie.split(';');
			
			for (let cookie of cookieArray) {
				cookie = cookie.trim();
				const [key, value] = cookie.split('=');
				if (key && value) {
					cookies[decodeURIComponent(key)] = decodeURIComponent(value);
				}
			}
			return cookies;
		} catch (error) {
			console.error('Cookie getAll error:', error);
			return {};
		}
	}

	// Clear all cookies (조심해서 사용!)
	static clear(): void {
		try {
			const cookies = this.getAll();
			for (const key of Object.keys(cookies)) {
				this.remove(key);
			}
		} catch (error) {
			console.error('Cookie clear error:', error);
		}
	}
}

