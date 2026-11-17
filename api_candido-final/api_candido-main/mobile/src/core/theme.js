export const colors = {
  background: '#F4F3FB',
  surface: '#FFFFFF',
  ink: '#1E1B2E',
  muted: '#76728A',
  placeholder: '#A9A5BD',
  primary: '#6554C0',
  primaryDark: '#4C3FA3',
  soft: '#EEEAFD',
  border: '#E7E4F3',
  danger: '#D6395B',
  dangerSoft: '#FDE8EC',
  success: '#1F9D6B',
  successSoft: '#E3F6EE',
  overlay: 'rgba(30, 27, 46, 0.55)',
};

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 };

export const shadow = {
  shadowColor: '#2A2160',
  shadowOpacity: 0.08,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

export const PLATAFORMAS = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];

export const platformColors = {
  PC: '#3B82F6',
  PlayStation: '#2563EB',
  Xbox: '#16A34A',
  'Nintendo Switch': '#E11D48',
  Mobile: '#F59E0B',
};

export function platformColor(name) {
  return platformColors[name] || colors.primary;
}
