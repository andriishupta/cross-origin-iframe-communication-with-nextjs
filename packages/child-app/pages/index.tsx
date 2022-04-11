import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  HStack,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

const PARENT_APP_URL = process.env.NEXT_PUBLIC_PARENT_APP_URL ?? 'http://localhost:4200';

type Message = {
  type: string;
  value: string;
};

export default function Home() {
  const [token, setToken] = useState<string>('');

  const { colorMode, toggleColorMode } = useColorMode();
  const isLightTheme = colorMode === 'light';

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== PARENT_APP_URL) {
        // skip other messages from(for ex.) extensions
        return;
      }

      const message: Message = event.data;

      if (message?.type === 'token-from-parent') {
        setToken(message.value);
      } else if (message?.type === 'theme-from-parent') {
        toggleColorMode()
      } else {
        console.error('NOT_VALID_MESSAGE');
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [toggleColorMode, setToken]);

  useEffect(() => {
    if (token) {
      const interval = window.setInterval(() => {
        postMessage({
          type: 'token-expired-from-child',
          value: token
        })
        setToken('')
      }, 5000); // every 5 seconds
      return () => clearInterval(interval);
    }
  }, [token, setToken]);

  const postMessage = (message: Message) => {
    window.parent.postMessage(message, PARENT_APP_URL);
  };

  const toggleTheme = () => {
    const nextColorMode = isLightTheme ? 'dark' : 'light';
    toggleColorMode();
    postMessage({
      type: 'theme-from-child',
      value: nextColorMode,
    });
  };

  return (
    <>
      <Container maxW={'5xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 20 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            lineHeight={'110%'}
          >
            <Text as={'span'} color={'purple.400'}>
              👶 Child App
            </Text>
          </Heading>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            lineHeight={'110%'}
          >
            <Text as={'span'} color={'purple.400'}>
              Token from parent: { token || 'NOT_VALID' }
            </Text>
          </Heading>
          <Text as={'span'} color={'purple.400'}>
            { token ? '*will expire in 5 seconds' :'' }
          </Text>
          <Center>
            <HStack>
              <Button
                colorScheme={'purple'}
                bg={'purple.400'}
                rounded={'full'}
                px={6}
                _hover={{
                  bg: 'purple.500',
                }}
                onClick={toggleTheme}
              >
                Toggle Theme(both ways)
              </Button>
            </HStack>
          </Center>
          )
        </Stack>
      </Container>
    </>
  );
}
