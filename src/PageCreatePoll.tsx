import * as React from "react";

import { useHistory } from "react-router-dom";

import useFingerpint from "./useFingerprint";
import useSimpleForm from "./useSimpleForm";
import usePollCreator from "./usePollCreator";
import { Box, TextInput, Button, FormField, TextArea, Text } from "grommet";

declare global {
  interface Window {
    username: string;
    password: string;
  }
}

interface Poll {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  description: string;
}

export default function PageCreatePoll() {
  const [createPoll, status, pollId] = usePollCreator();
  const { fields, setField, errors, addErrror, resetErrors } = useSimpleForm<
    Poll
  >({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    description: ""
  });
  const history = useHistory();

  switch (status) {
    case 0:
      break;
    case 1:
      return <div>Criando banco</div>;
    case 2:
      return <div>Registrando a pesquisa</div>;
    case 3:
      console.log(pollId);
      history.push(`/pesquisa/${pollId}/acompanhar`);
      break;
    default:
      return <div>Código desconhecido</div>;
  }

  return (
    <Box direction="column" pad="medium" width="medium">
      <form
        onSubmit={async () => {
          resetErrors();
          if (fields.password !== fields.confirmPassword) {
            addErrror("A senha e a confirmação devem ser iguais");
          }
          const user = {
            name: fields.name,
            username: fields.username,
            password: fields.password,
            description: fields.description
          };
          await createPoll(user);
        }}
      >
        <Box>
          {errors.map((err: string, n: number) => (
            <p key={n}>{err}</p>
          ))}
        </Box>
        <FormField label="Nome" htmlFor="name" required>
          <TextInput
            id="name"
            type="text"
            minLength={2}
            required
            onChange={setField("name")}
          />
        </FormField>
        <FormField label="Usuário" htmlFor="usuario" required>
          <TextInput
            id="usuario"
            type="text"
            minLength={9}
            required
            onChange={setField("username")}
          />
        </FormField>
        <FormField label="Senha" htmlFor="senha" required>
          <TextInput
            id="senha"
            type="password"
            minLength={9}
            required
            onChange={setField("password")}
          />
        </FormField>
        <FormField label="Confirme a senha" htmlFor="confirmarSenha" required>
          <TextInput
            id="confirmarSenha"
            type="password"
            minLength={9}
            required
            onChange={setField("passwordConfirmation")}
          />
        </FormField>
        <FormField label="Descrição" htmlFor="descricao">
          <TextArea
            id="descricao"
            maxLength={140}
            onChange={setField("description")}
          />
        </FormField>

        <Button type="submit" label="Iniciar pesquisa" primary />
        <Text margin={{ left: "small" }} size="small" color="status-critical">
          * Required Field
        </Text>
      </form>
    </Box>
  );
}
