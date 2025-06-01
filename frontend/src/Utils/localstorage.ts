const extractToken = () => {
  if (!localStorage.getItem("token")) {
    return;
  }
  const token = JSON.parse(localStorage.getItem("token") as string);
  return token;
};

const substituteUserData = (newUserData: string) => {
  if (!localStorage.getItem("userdata")) {
    return;
  }

  localStorage.removeItem("userdata");
  localStorage.setItem("userdata", newUserData);
  const updated_userdata = JSON.parse(atob(newUserData));

  return updated_userdata;
};
export const LocalStorageUtils = {
  extractToken,
  substituteUserData,
};
