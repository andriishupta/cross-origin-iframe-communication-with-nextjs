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

const CHILD_APP_URL = process.env.NEXT_PUBLIC_CHILD_APP_URL ?? 'http://localhost:4201';

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
    iframeRef.current.contentWindow.postMessage(message, CHILD_APP_URL); // OR use '*' to handle all origins
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

  const sendToken = () =>
    postMessage({
      type: 'token',
      message: 'test',
    });

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
            <Text as={'span'} color={'green.400'}>
              🧑 Parent App
            </Text>
          </Heading>
          <Center>
            <HStack>
              <Button
                style={{ marginTop: '12px' }}
                colorScheme={'green'}
                bg={'green.400'}
                rounded={'full'}
                px={6}
                _hover={{
                  bg: 'green.500',
                }}
                onClick={toggleTheme}
              >
                Toggle Theme
              </Button>
              <Button
                style={{ marginTop: '12px' }}
                colorScheme={'green'}
                bg={'green.400'}
                rounded={'full'}
                px={6}
                _hover={{
                  bg: 'green.500',
                }}
                onClick={sendToken}
              >
                Send Token
              </Button>
            </HStack>
          </Center>
          <iframe
            ref={iframeRef}
            src={CHILD_APP_URL}
            onLoad={sendToken}
            width={'100%'}
            height={'300px'}
          />
          )
        </Stack>
      </Container>
    </>
  );
}
