import * as React from "react";

import { useHistory, useParams } from "react-router-dom";

import useSimpleForm from "./useSimpleForm";
import useLogin from "./useLogin";
import { FormField, Button, Text, Box, TextInput } from "grommet";

declare global {
  interface Window {
    username: string;
    password: string;
  }
}

interface Login {
  user: string;
  password: string;
}

export default function PageCreatePoll() {
  const { pollId } = useParams();
  if (!pollId) throw new Error("cannot retrieve pollId");
  const { login } = useLogin(pollId);
  const history = useHistory();
  const { fields, setField } = useSimpleForm<Login>({
    user: "",
    password: ""
  });

  return (
    <Box>
      <form
        onSubmit={async () => {
          if (await login(fields.user, fields.password)) {
            history.push(`/pesquisa/${pollId}/acompanhar`);
          }
        }}
      >
        <FormField label="Usuário" htmlFor="usuario" required>
          <TextInput
            id="usuario"
            type="text"
            minLength={9}
            required
            onChange={setField("user")}
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
        <Button type="submit" label="Entrar" primary />
        <Text margin={{ left: "small" }} size="small" color="status-critical">
          * Required Field
        </Text>
      </form>
    </Box>
  );
}
