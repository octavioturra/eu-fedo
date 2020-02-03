import { useState } from "react";
export default function useSimpleForm<T>(initialState: T) {
  const [errors, setErrors] = useState([] as string[]);
  const [fields, setFields] = useState(initialState);

  function setField(field: string) {
    return (ev: any | undefined) =>
      setFields({ ...fields, [field]: ev.target.value });
  }

  return {
    fields,
    setField,
    errors,
    addErrror(error: string) {
      setErrors([...errors, error]);
    },
    resetErrors() {
      setErrors([]);
    }
  };
}
