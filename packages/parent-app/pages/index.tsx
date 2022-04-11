import { useEffect, useRef, useState } from 'react';

import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  useColorMode,
  Center,
  Input,
  Flex,
} from '@chakra-ui/react';

import { useToast } from '@chakra-ui/react';

const CHILD_APP_URL = process.env.NEXT_PUBLIC_CHILD_APP_URL ?? 'http://localhost:4201';

type Message = {
  type: string;
  value: string;
};

export default function Home() {
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const isLightTheme = colorMode === 'light';

  const [token, setToken] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== CHILD_APP_URL) {
        // skip other messages from(for example.) extensions
        return;
      }

      const message: Message = event.data;

      if (message?.type === 'token-expired-from-child') {
        toast({
          title: 'Token expired from child',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top'
        });
        setToken('')
      } else if (message?.type === 'theme-from-child') {
        toggleColorMode();
      } else {
        console.error('NOT_VALID_MESSAGE: ', JSON.stringify(message));
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [toggleColorMode, toast, setToken]);

  const postMessage = (message: Message) => {
    iframeRef.current.contentWindow.postMessage(message, CHILD_APP_URL); // OR use '*' to handle all origins
  };

  const toggleTheme = () => {
    const nextColorMode = isLightTheme ? 'dark' : 'light';
    toggleColorMode();
    postMessage({
      type: 'theme-from-parent',
      value: nextColorMode,
    });
  };

  const sendToken = (onLoad = false) =>
    postMessage({
      type: 'token-from-parent',
      value: onLoad ? 'INITIAL_TOKEN' : token,
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
            <Button
              colorScheme={'green'}
              bg={'green.400'}
              rounded={'full'}
              px={6}
              margin={0}
              _hover={{
                bg: 'green.500',
              }}
              onClick={toggleTheme}
            >
              Toggle Theme(both ways)
            </Button>
          </Center>
          <Center>
            <Flex alignItems={'center'} justifyContent={'center'}>
              <Input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="enter some value"
                size="sm"
                rounded={'full'}
                colorScheme={'green'}
                background={isLightTheme ? 'white' : 'rgba(0,0,0,0.75)'}
              />
              <Button
                colorScheme={'green'}
                bg={'green.400'}
                rounded={'full'}
                px={6}
                mx={3}
                _hover={{
                  bg: 'green.500',
                }}
                onClick={() => sendToken()}
              >
                Send Token
              </Button>
            </Flex>
          </Center>
          <iframe
            ref={iframeRef}
            src={CHILD_APP_URL}
            onLoad={() => sendToken(true)}
            style={{ background: 'white' }}
            width={'100%'}
            height={'450px'}
          />
          )
        </Stack>
      </Container>
    </>
  );
}
