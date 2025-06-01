import Crm_SubMetric from "./components/submetric";
import PersonIcon from "@mui/icons-material/Person";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface IKpiInfo {
  totalOpportunities: number;
  opportunitiesWon: number;
  activitiesPlanned: number;
  opportunitiesOpen: any;
}
const MainKpiList: React.FC<IKpiInfo> = ({
  totalOpportunities,
  opportunitiesWon,
  activitiesPlanned,
  opportunitiesOpen,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6 bp">
      <Crm_SubMetric
        icon={<PersonIcon />}
        submetricData={{
          title: "Opportunità totali",
          data: totalOpportunities,
        }}
      />
      <Crm_SubMetric
        icon={<AssignmentIcon />}
        submetricData={{
          title: "Opportunità vinte negli ultimi 30 giorni",
          data: opportunitiesWon,
        }}
      />
      <Crm_SubMetric
        icon={<MonetizationOnIcon />}
        submetricData={{
          title: "Attività pianificate nei prossimi 7 giorni",
          data: activitiesPlanned,
        }}
      />
      <Crm_SubMetric
        icon={<MonetizationOnIcon />}
        submetricData={{
          title: "Opportunità Aperte",
          data: opportunitiesOpen?.length,
        }}
      />
    </div>
  );
};

export default MainKpiList;
