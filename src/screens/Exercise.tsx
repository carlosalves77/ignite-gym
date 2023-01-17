import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import {
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  Box,
  ScrollView,
  useToast,
} from "native-base";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvG from "@assets/repetitions.svg";

import { Loading } from "@components/Loading";
import { Button } from "@components/Button";

type RouteParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  const [sendRegister, setSendRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const toast = useToast();
  const route = useRoute();

  const { exerciseId } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    try {
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
      setLoading(true);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível buscar o exercício";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendRegister(true);

      await api.post("/history", { exercise_id: exerciseId });

      toast.show({
        title: "Parabéns! Exercicio registrado com sucesso!",
        placement: "top",
        bgColor: "green.700",
      });

      navigation.navigate("history");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível registrar o exercício";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setSendRegister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" size={6} color="green.500" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          mt={4}
          mb={8}
          alignItems="center"
        >
          <Heading
            color="gray.100"
            fontSize="lg"
            fontFamily="heading"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView>
          <VStack p={8}>
            {exercise.demo && (
              <Box rounded="lg" mb={3} overflow="hidden">
                <Image
                  w="full"
                  h={80}
                  source={{
                    uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                  }}
                  alt="Imagem do exercício"
                  resizeMode="cover"
                  rounded="lg"
                />
              </Box>
            )}
            <Box bg="gray.600" rounded="md" pb={4} px={4}>
              <HStack
                alignItems="center"
                justifyContent="space-around"
                mb={6}
                mt={5}
              >
                <HStack>
                  <SeriesSvg />
                  <Text color="gray.200" ml="2">
                    {exercise.series} séries
                  </Text>
                </HStack>
                <HStack>
                  <RepetitionsSvG />
                  <Text color="gray.200" ml="2">
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>
              <Button
                title="Marcar como realizado"
                isLoading={sendRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
}
