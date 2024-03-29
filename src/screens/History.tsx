import { useCallback, useState } from "react";
import {
  SectionList,
  Text,
  useToast,
  Heading,
  VStack,
  Center,
} from "native-base";
import { useFocusEffect, useRoute } from "@react-navigation/native";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";
import { Loading } from "@components/Loading";

import { api } from "@services/api";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

import { AppError } from "@utils/AppError";
import { useAuth } from "@hooks/useAuth";

export function History() {
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  const toast = useToast();
  const { refreshToken } = useAuth();

  async function fetchHistory() {
    try {
      setLoading(true);
      const response = await api.get("/history");
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro ao buscar histórico";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [refreshToken])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />
      {loading ? (
        <Loading />
      ) : exercises?.length > 0 ? (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading
              color="gray.200"
              fontFamily="heading"
              fontSize="md"
              mt={10}
              mb={3}
            >
              {section.title}
            </Heading>
          )}
          px={5}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: "center" }
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Center flex={1}>
          <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda. {"\n"} Vamos fazer exercícios
            hoje?
          </Text>
        </Center>
      )}
    </VStack>
  );
}
