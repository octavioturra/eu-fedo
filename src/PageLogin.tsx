import * as React from "react";

import { useHistory, useParams } from "react-router-dom";

import useSimpleForm from "./useSimpleForm";
import useLogin from "./useLogin";

// import { AuthPair } from "./_DSL";

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
    <form
      onSubmit={async () => {
        if (await login(fields.user, fields.password)) {
          history.push(`/pesquisa/${pollId}/acompanhar`);
        }
      }}
    >
      <div>
        <label htmlFor="usuario">Usuário</label>
        <input
          id="usuario"
          type="text"
          minLength={9}
          required
          onChange={setField("user")}
        />
      </div>
      <div>
        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          minLength={9}
          required
          onChange={setField("password")}
        />
      </div>
      <button type="submit">Entrar</button>
    </form>
  );
}
