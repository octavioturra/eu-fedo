import * as React from "react";

import { useParams } from "react-router-dom";
import usePollAnswers from "./usePollAnswers";
import useLogin from "./useLogin";
import { AnswerPair } from "./_DSL";
import { Box, Text, Heading } from "grommet";

function getShareURL(url: string): string {
  return url
    .split(/\//gi)
    .slice(0, -1)
    .join("/");
}

export default React.memo(function PageFollowUp() {
  const { pollId } = useParams();
  const url = getShareURL(window.location.href);

  if (!pollId) throw new Error("Cannot retrieve pollId");

  const { checkAuthenticated, authData } = useLogin(pollId);
  checkAuthenticated();
  const { username, password } = authData;

  const { answers, status } = usePollAnswers(username, password, pollId);

  console.warn("PageFollowUp", pollId, username, password, answers, status);

  switch (status) {
    case -1:
      return <></>;
    case 0:
    case 1:
      return <div>Criando banco</div>;
    case 2:
      return <div>Buscando as respostas</div>;
    case 3:
      break;
    default:
      return <div>Código desconhecido</div>;
  }

  if (answers.length < 3) {
    return (
      <Box>
        <Heading level={1}>
          Não tem respostas suficente... tente pedir mais
        </Heading>
        <Text>Compartilhe a url:</Text>
        <Text weight="bold">{url}</Text>
      </Box>
    );
  }

  const result =
    answers.reduce((acc: number, a: AnswerPair) => a.answer.level + acc, 0) /
    answers.length;

  const positive = result > 5;

  return (
    <Box>
      <Heading level={2}>Resultados</Heading>
      <Text>
        O resultado foi{" "}
        <Text weight="bold">
          {positive ? "Sim, você fede" : "Não, voce não fede"}
        </Text>
      </Text>
    </Box>
  );
});
