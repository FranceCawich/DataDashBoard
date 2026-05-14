import { createContext, useContext } from 'react';

export const ThemeCtx = createContext();
export const useTheme = () => useContext(ThemeCtx);

export function makeTokens(dark) {
  return dark ? {
    bg:           '#0A0C10',
    sidebar:      '#0D1117',
    surface:      '#0D1117',
    surfaceHover: '#161B22',
    surfaceAlt:   '#111827',
    border:       '#1E2433',
    borderHover:  '#2A3347',
    borderActive: '#2563EB',
    text:         '#E2E8F0',
    textMuted:    '#64748B',
    textDim:      '#334155',
    blue:         '#2563EB',
    blueDark:     '#1D4ED8',
    blueBg:       'rgba(37,99,235,0.08)',
    blueBorder:   'rgba(37,99,235,0.35)',
    inputBg:      '#080A0F',
    btnPrimary:   '#2563EB',
    btnPrimaryHov:'#1D4ED8',
    scrollbar:    '#1E2433',
    accent:       '#0891B2',
    success:      '#059669',
    navActive:    '#161B22',
  } : {
    bg:           '#F8FAFC',
    sidebar:      '#FFFFFF',
    surface:      '#FFFFFF',
    surfaceHover: '#F1F5F9',
    surfaceAlt:   '#F8FAFC',
    border:       '#E2E8F0',
    borderHover:  '#CBD5E1',
    borderActive: '#2563EB',
    text:         '#0F172A',
    textMuted:    '#64748B',
    textDim:      '#CBD5E1',
    blue:         '#2563EB',
    blueDark:     '#1D4ED8',
    blueBg:       'rgba(37,99,235,0.05)',
    blueBorder:   'rgba(37,99,235,0.25)',
    inputBg:      '#FFFFFF',
    btnPrimary:   '#2563EB',
    btnPrimaryHov:'#1D4ED8',
    scrollbar:    '#E2E8F0',
    accent:       '#0891B2',
    success:      '#059669',
    navActive:    '#F1F5F9',
  };
}
