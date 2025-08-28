/**
 * 레이아웃 관련 상수들
 */

// 사이드바 너비
export const DRAWER_WIDTH = 240;

// 헤더 높이 
export const HEADER_HEIGHT = 64;

// 기타 레이아웃 상수들
export const LAYOUT_CONSTANTS = {
  DRAWER_WIDTH,
  HEADER_HEIGHT,
  SIDEBAR_COLLAPSED_WIDTH: 56,
  MOBILE_BREAKPOINT: 'md' as const,
} as const;
