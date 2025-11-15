import type { FormEvent, PropsWithChildren } from "react";

interface FormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

const Form = ({
  onSubmit,
  children,
  className,
}: PropsWithChildren<FormProps>) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault(); // Prevent default form submission
        onSubmit(event);
      }}
      className={` ${className}`} // Default spacing between form fields
    >
      {children}
    </form>
  );
};

export default Form;
