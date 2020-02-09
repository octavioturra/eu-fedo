import * as React from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Button } from "grommet";

export default function PageHome() {
  return (
    <Box className="App" direction="column" pad="medium" width="medium">
      <Heading level={1}>Eu fedo?</Heading>
      <Heading level={2}>Receba o feedback difícil dos seus amigos</Heading>
      <Link to="/pesquisa/criar">
        <Button label="criar pesquisa" />
      </Link>
    </Box>
  );
}
