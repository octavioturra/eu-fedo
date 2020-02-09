import { useState, useEffect } from "react";
import { getDatabaseInstance } from "./PollDatabase";
import { AnswerPair, Answer, IdentityToken, Poll } from "./_DSL";
import { encryptAnswerPair } from "./PollEncryptions";

interface UsePollOutput {
  saveAnswer: (leve: number) => Promise<void>;
  status: number;
  poll: Poll;
}

export default function usePoll(
  fingerprint: string,
  pollId: string
): UsePollOutput {
  const [status, setStatus] = useState(0);
  const [poll, setPoll] = useState<Poll>({
    name: "",
    description: ""
  });

  const pdb = getDatabaseInstance(pollId, fingerprint);

  useEffect(
    function() {
      async function startPoll() {
        await pdb.waitPrepared();
        setStatus(4);
        const poll = await pdb.retrievePoll();
        setStatus(5);
        setPoll(poll);
      }

      if (fingerprint && pollId && status === 0) {
        pdb.waitPrepared().then(startPoll);
      }
    },
    [pdb.prepared, pdb, status, fingerprint, pollId, poll]
  );

  async function saveAnswer(level: number) {
    setStatus(1);
    const key = await pdb.retrieveEncryptKey();

    const answer = new Answer(level);
    const identity = new IdentityToken(fingerprint);
    setStatus(2);

    const pair = new AnswerPair(identity, answer);
    const encryptedData = await encryptAnswerPair(key, pair);
    pdb.persistAnswer(encryptedData);
    setStatus(3);
  }

  return { saveAnswer, status, poll };
}
