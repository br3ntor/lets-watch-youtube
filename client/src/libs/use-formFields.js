import { useState } from "react";

export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function (event) {
      setValues({
        ...fields,
        [event.target.name]: event.target.value,
      });
    },
  ];
}

// I'm not sure which is better event.target.id or event.target.name
// The id of a form is also used with the for attribute, just a thought
