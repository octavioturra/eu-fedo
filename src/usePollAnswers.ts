import { useState, useEffect } from "react";
import { getDatabaseInstance } from "./PollDatabase";
import { Poll, EncryptedAnswer, AuthPair, AnswerPair, Answer } from "./_DSL";
import {
  decryptAnswerPair,
  authenticate,
  generateUnsecuredPrivatekey
} from "./PollEncryptions";

interface UsePollResultData {
  answers: Array<AnswerPair>;
  status: number;
  poll: Poll | undefined;
}

export default function usePollAnswers(
  username: string | null,
  password: string | null,
  pollId: string
): UsePollResultData {
  const [answers, setAnswers] = useState([] as AnswerPair[]);
  const [status, setStatus] = useState(0);
  const [poll, setPoll] = useState<Poll>();

  const pdb = getDatabaseInstance(pollId);
  console.log("pdb", pdb);

  useEffect(() => {
    async function startPoll() {
      if (!username || !password) {
        setStatus(-1);
        return;
      }

      const auth = new AuthPair(username, password);
      await authenticate(auth);

      console.log("obtendo key");
      const securePrivateKey = await pdb.retrieveSecuredPrivateKey();
      console.log("secureKey", securePrivateKey);
      const key = await generateUnsecuredPrivatekey(securePrivateKey, auth);
      console.log("key", key);
      setStatus(1);

      console.log("obtendo poll");
      const poll = await pdb.retrievePoll();
      console.log("poll", poll);
      setPoll(poll);
      setStatus(2);

      console.log("obtendo respostas");
      const encryptedAnswers = await pdb.retrieveAnswers();
      const answersData = encryptedAnswers.map(
        async (a: EncryptedAnswer) => await decryptAnswerPair(key, a)
      );
      const data = await Promise.all(answersData);
      console.log("answers", data);
      setAnswers(data);
      setStatus(3);
    }

    if (status === 0) pdb.waitPrepared().then(() => startPoll());
  }, [status, password, username, pdb]);

  return { answers, status, poll };
}
