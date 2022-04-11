import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: mode('radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(159,122,234,1) 100%)', 'radial-gradient(circle, rgba(0,0,0,0.75) 0%, rgba(159,122,234,1) 100%)')(props),
      },
    }),
  },
});

export default theme;
