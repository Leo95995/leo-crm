export const validators = () => {
  const passwordValidator = (passwordToCheck: string) => {
    const hasUppercase = /[A-Z]/.test(passwordToCheck);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(passwordToCheck);

    if (!hasUppercase) {
      return {
        status: true,
        message: "La password deve contenere almeno una lettera maiuscola",
      };
    }
    if (!hasSpecialChar) {
      return {
        status: true,
        message: "La password deve contenere almeno un carattere speciale",
      };
    }
    if (passwordToCheck.length < 8) {
      return {
        status: true,
        message: "La password deve essere lunga almeno 8 caratteri",
      };
    }
    return { status: false };
  };

  const usernameValidator = (username: string) => {
    if (username.length < 5) {
      return {
        status: true,
        message: "Lo username deve essere lungo almeno 5 caratteri.",
      };
    }
    return { status: false };
  };

  const emailValidator = (email: string) => {
    if (!email.includes("@") || !email.includes(".")) {
      return { status: true, message: "Email inserita non valida" };
    } else {
      return { status: false };
    }
  };
  const termConditionsValidator = (value: boolean) => {
    if (!value) {
      return {
        status: true,
        message: "Devi accettare i termini e le condizioni per registrarti.",
      };
    }
    return { status: false };
  };

  return {
    passwordValidator,
    usernameValidator,
    emailValidator,
    termConditionsValidator,
  };
};
