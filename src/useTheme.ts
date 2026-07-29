import { useColorScheme } from 'react-native';
import { getTheme, type Theme } from './theme';

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return getTheme(scheme);
}
