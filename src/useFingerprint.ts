import { useState, useEffect } from "react";
import getFingerprint from "./getFingerprint";

export default function useFingerprint() {
  const [fingerprint, setFingerprint] = useState("");

  useEffect(() => {
    async function prepareFingerprint() {
      const fingerprint = await getFingerprint();
      setFingerprint(fingerprint);
    }

    prepareFingerprint();
  }, [fingerprint]);

  return fingerprint;
}
