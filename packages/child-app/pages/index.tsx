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
import { useRef, useState } from 'react';

const PARENT_APP_URL = process.env.NEXT_PUBLIC_PARENT_APP_URL ?? 'http://localhost:4200';

type Message = {
  type: string;
  message: string;
};

export default function Home() {
  const [_logs, _setLogs] = useState<string[]>([]);

  const [token, setToken] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { colorMode, toggleColorMode } = useColorMode();

  const _appendLog = (log: string) => _setLogs((currentLogs) => [...currentLogs, log]);

  const postMessage = (message: Message) => {
    // iframeRef.current.contentWindow.postMessage(message, PARENT_APP_URL); // OR use '*' to handle all origins
    _appendLog(`sent message: ${JSON.stringify(message)}`);
  };

  const toggleTheme = () => {
    const nextColorMode = colorMode === 'light' ? 'dark' : 'light';
    toggleColorMode();
    postMessage({
      type: 'theme',
      message: nextColorMode,
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
          <Center>
            <HStack>
              <Button
                style={{ marginTop: '12px' }}
                colorScheme={'purple'}
                bg={'purple.400'}
                rounded={'full'}
                px={6}
                _hover={{
                  bg: 'purple.500',
                }}
                onClick={toggleTheme}
              >
                Toggle Theme
              </Button>
            </HStack>
          </Center>
          )
        </Stack>
      </Container>
    </>
  );
}
