import { PublicClient } from "./clientSanitizer";
import { PublicUser } from "./userSanitizer";

interface PublicOpportunity {
  _id?: string;
  name?: string;
  value?: number;
  lastName?: string;
  stage: string;
  contact_id: any;
  user_id: any;
  activities?: any[];
}

const sanitizeOpportunityData = (
  opportunity: PublicOpportunity,
  viewerRole: string
): Partial<PublicOpportunity> => {
  const base = {
    _id: opportunity?._id,
    name: opportunity?.name,
    value: opportunity.value,
    lastName: opportunity.lastName,
    stage: opportunity.stage,
    contact_id: opportunity.contact_id,
    user_id: opportunity.user_id,
    activities: opportunity.activities,
  };

  return base;
};

// per liste:
const sanitizeOpportunityList = (
  opportunities: PublicOpportunity[],
  viewerRole: string
) =>
  opportunities.map((opportunity) =>
    sanitizeOpportunityData(opportunity, viewerRole)
  );

export const OpportunitySanitizer = {
  sanitizeOpportunityData,
  sanitizeOpportunityList,
};
