export enum activityStatus {
  NUOVA = "nuova", 
  IN_CORSO  ="in corso", 
  VINTA = "vinta", 
  PERSA = "persa"
}

export interface IActivity {
  description: string;
  date: string;
  _id: string;
  status: activityStatus;
}

export interface IOpportunity {
  name: string;
  value: number;
  stage: string;
  contact_id: any;
  user_id: any;
  activities?: IActivity[];
}
