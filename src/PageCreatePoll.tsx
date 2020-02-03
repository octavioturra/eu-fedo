import * as React from "react";

import { useHistory } from "react-router-dom";

import useFingerpint from "./useFingerprint";
import useSimpleForm from "./useSimpleForm";
import usePollCreator from "./usePollCreator";

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
      <div>
        {errors.map((err: string, n: number) => (
          <p key={n}>{err}</p>
        ))}
      </div>
      <div>
        <label htmlFor="usuario">Nome*</label>
        <input
          id="name"
          type="text"
          minLength={2}
          required
          onChange={setField("name")}
        />
      </div>
      <div>
        <label htmlFor="usuario">Usuário*</label>
        <input
          id="usuario"
          type="text"
          minLength={9}
          required
          onChange={setField("username")}
        />
      </div>
      <div>
        <label htmlFor="senha">Senha*</label>
        <input
          id="senha"
          type="password"
          minLength={9}
          required
          onChange={setField("password")}
        />
      </div>
      <div>
        <label htmlFor="confirmarSenha">Confirme a senha*</label>
        <input
          id="confirmarSenha"
          type="password"
          minLength={9}
          required
          onChange={setField("passwordConfirmation")}
        />
      </div>
      <div>
        <label htmlFor="descricao">Descrição</label>
        <input
          id="descricao"
          type="text"
          maxLength={140}
          onChange={setField("description")}
        />
      </div>
      <small>* campos obrigatórios</small>
      <button type="submit">Iniciar pesquisa</button>
    </form>
  );
}
