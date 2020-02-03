import * as React from "react";

import { useParams } from "react-router-dom";
import usePollAnswers from "./usePollAnswers";
import useLogin from "./useLogin";
import { AnswerPair } from "./_DSL";

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
      <>
        <h1>Não tem respostas suficente... tente pedir mais</h1>
        <p>
          Compartilhe a url <b>{url}</b>
        </p>
      </>
    );
  }

  const result =
    answers.reduce((acc: number, a: AnswerPair) => a.answer.level + acc, 0) /
    answers.length;

  const positive = result > 5;

  return (
    <>
      <h1>Resultados</h1>
      <p>
        O resultado foi {positive ? "Sim, você fede" : "Não, voce não fede"}
      </p>
    </>
  );
});
