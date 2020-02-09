import { useState } from "react";

import PollDatabase, { getDatabaseInstance } from "./PollDatabase";

import {
  generatePollId,
  authenticate,
  generateAdminKeyPair,
  generateSecuredPrivateKey
} from "./PollEncryptions";
import { useAuth } from "./useLogin";

interface User {
  name: string;
  username: string;
  password: string;
  description: string;
}

export default function usePollCreator(): [Function, number, string] {
  const [status, setStatus] = useState(0);
  const [pollId, setPollId] = useState("");
  const setAuth = useAuth();

  const callback = (user: User, fingerprint: string) => {
    console.log("calling poll for", user.username, user.password);
    async function createPoll() {
      const authPair = {
        user: user.username,
        password: user.password
      };
      setStatus(1);
      console.log("authenticating");
      await authenticate(authPair);

      const pollId = await generatePollId(authPair);
      setAuth(user.username, user.password);
      setPollId(pollId);
      const pdb = getDatabaseInstance(pollId, fingerprint);
      console.log("preparing database");
      await pdb.waitPrepared();
      console.log("database prepared");

      console.log("creating poll");
      await pdb.createPoll(user.name, user.description);

      console.log("authenticated");
      const adminKeyPair = await generateAdminKeyPair();
      console.log("generating keys");
      const securedPrivateKey = await generateSecuredPrivateKey(
        adminKeyPair.privateKey
      );
      console.log("poll prepared");
      setStatus(2);
      console.log("persisting poll keys");
      await pdb.persistSecuredPrivateKey(securedPrivateKey);
      await pdb.persistEncryptKey(adminKeyPair.publicKey);
      console.log("keys persisted");
      setStatus(3);
    }
    createPoll();
  };

  return [callback, status, pollId];
}
