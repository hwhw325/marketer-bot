// config/brand.ts
export const BRAND = {
  LOGO_SRC_LIGHT: "/logo-light.png",
  LOGO_SRC_DARK: "/logo-dark.png",
  USE_LIGHT_ALWAYS: true,

  // ✅ 데스크톱 기준 (스크린샷 느낌에 맞춘 값)
  headerH: 100,  // 헤더 높이
  logoW: 260,    // 로고 너비
  logoH: 56,     // 로고 높이

  // ✅ 모바일(<=640px)
  mobile: {
    headerH: 60,
    logoW: 160,
    logoH: 36,
  },
} as const;
