import { Center, Heading, Text } from "native-base";

type Porps = {
  title: string;
};

export function ScreenHeader({ title }: Porps) {
  return (
    <Center bg="gray.600" pb={6} pt={16}>
      <Heading color="gray.100" fontSize="xl">
        {title}
      </Heading>
    </Center>
  );
}
