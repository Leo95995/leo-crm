interface Option {
  value: string;
  label: string;
}
export const opportunityOptions: Option[] = [
  { value: "nuova", label: "Nuova" },
  { value: "in corso", label: "In corso" },
  { value: "vinta", label: "Vinta" },
  { value: "persa", label: "Persa" },
];

export const activityOptions: Option[] = [
  {
    value: "In corso",
    label: "In corso",
  },
  {
    value: "Completata",
    label: "Completata",
  },
  {
    value: "Pianificata",
    label: "Pianificata",
  },
  {
    value: "In attesa",
    label: "In attesa",
  },
];



export const getOpportunityBadgeState = (stage: string) => {
  if (!stage) {
    return "primary";
  }
  switch (stage) {
    case "nuova":
      return "primary";
    case "in corso":
      return "warning";
    case "vinta":
      return "success";
    case "persa":
      return "error";
    default:
      return "primary";
  }
};

export const getActivityBadgeState = (status: string) => {
  switch (status) {
    case "In corso":
      return "warning";
    case "Completata":
      return "success";
    case "Pianificata":
      return "primary";
    case "In attesa":
      return "primary";
    default:
      return "primary";
  }
};


export const getItalianRole = (role: string) => {
  switch (role) {
    case "admin":
      return "Amministratore";
    case "viewer":
      return "Visitatore";
    case "manager":
      return "Manager";
    default:
      return "primary";
  }
}