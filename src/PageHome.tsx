import * as React from "react";
import { Link } from "react-router-dom";

export default function PageHome() {
  return (
    <div className="App">
      <h1>Eu fedo?</h1>
      <h2>Receba o feedback difícil dos seus amigos</h2>
      <Link to="/criar">Criar pesquisa</Link>
    </div>
  );
}
