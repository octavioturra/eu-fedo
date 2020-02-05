import * as React from "react";
import useSimpleForm from "./useSimpleForm";
import useFingerprint from "./useFingerprint";
import { useParams, useHistory } from "react-router-dom";
import usePoll from "./usePoll";
import {
  Box,
  RangeInput,
  Grid,
  Heading,
  Text,
  Button,
  FormField
} from "grommet";

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
    <Box width="medium">
      <form
        onSubmit={() => {
          saveAnswer(fields.level);
        }}
      >
        <Box>
          <Heading level={1}>{poll.name}</Heading>
          <Text>{poll.description}</Text>{" "}
        </Box>

        <FormField label="De 0 a 10 quanto fedo?" pad component={RangeInput}>
          <RangeInput
            max={10}
            min={0}
            onChange={setField("level")}
          ></RangeInput>
        </FormField>

        <Box direction="row" justify="between" margin={{ top: "medium" }}>
          <Button label="responder" type="submit" primary />
        </Box>
      </form>
    </Box>
  );
}
