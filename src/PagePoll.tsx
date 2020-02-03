import * as React from "react";
import useSimpleForm from "./useSimpleForm";
import useFingerprint from "./useFingerprint";
import { useParams, useHistory } from "react-router-dom";
import usePoll from "./usePoll";

class Answer {
  constructor(public level: number) {}
}

export default function PagePoll() {
  const { pollId } = useParams();
  if (!pollId) throw new Error("cannot retrieve pollId");
  const fingerprint = useFingerprint();
  const { saveAnswer, status, poll } = usePoll(fingerprint, pollId);

  const defaultAnswer = new Answer(0);
  const { fields, setField } = useSimpleForm(defaultAnswer);
  const history = useHistory();

  console.warn(pollId, fingerprint, poll, status);

  switch (status) {
    case 0:
    case 1:
    case 4:
      return <div>Criando banco</div>;
    case 2:
      return <div>Registrando a resposta</div>;
    case 3:
      history.push(`/pesquisa/${pollId}/respondido`);
      break;
    case 5:
      break;
    default:
      return <div>Código desconhecido</div>;
  }

  return (
    <form
      onSubmit={() => {
        saveAnswer(fields.level);
      }}
    >
      <div>
        <h1>{poll.name}</h1>
        <h2>{poll.description}</h2>{" "}
      </div>
      <div>
        <h3>De 0 a 10, quanto fedo?</h3>
        <div>
          <div>Não fede</div>
          <div>
            {Array(10)
              .fill(0)
              .map((_, n) => (
                <span key={n}>
                  <label htmlFor={`opt_${n}`}>{n}</label>
                  <input
                    type="radio"
                    id={`opt_${n}`}
                    onChange={setField("level")}
                  />
                </span>
              ))}
          </div>
          <div>Fede muito</div>
        </div>
      </div>
      <button type="submit">Responder</button>
    </form>
  );
}
