// 인증 관련 이벤트 시스템
export class AuthEventEmitter extends EventTarget {
  emitAuthError(reason: string) {
    this.dispatchEvent(new CustomEvent('authError', { detail: { reason } }));
  }

  emitAuthSuccess() {
    this.dispatchEvent(new CustomEvent('authSuccess'));
  }

  onAuthError(callback: (event: CustomEvent) => void) {
    this.addEventListener('authError', callback as EventListener);
    return () => this.removeEventListener('authError', callback as EventListener);
  }

  onAuthSuccess(callback: (event: CustomEvent) => void) {
    this.addEventListener('authSuccess', callback as EventListener);
    return () => this.removeEventListener('authSuccess', callback as EventListener);
  }
}

export const authEventEmitter = new AuthEventEmitter();
