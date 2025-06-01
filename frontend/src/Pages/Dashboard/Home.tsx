import PageMeta from "../../components/common/PageMeta";
import {  useEffect, useState } from "react";
import { OpportunityAPI } from "../../API/Opportunities/Opportunities";
import MainKpiList from "../../components/ecommerce/MainKpiList";
import ActivityDashTable from "./ActivityDashTable";
import OpportunityDashTable from "./OpportunityDashTable";

const Home: React.FC = () => {

  const [kpi_dashboard_info, setKpi_dashboard_info] = useState<any>();
  useEffect(() => {
    OpportunityAPI.getKPIDashboard()
      .then((res) => {
        if (res?.data) {
          setKpi_dashboard_info(res?.data);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <PageMeta title="Leo CRM | Home" description="CRM Leo" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-0">
          <MainKpiList
            totalOpportunities={kpi_dashboard_info?.totalOpportunities ?? 'Caricamento...'}
            opportunitiesWon={kpi_dashboard_info?.opportunitiesWon ?? 'Caricamento...'}
            opportunitiesOpen={kpi_dashboard_info?.opportunitiesOpen ?? 'Caricamento...'}
            activitiesPlanned={kpi_dashboard_info?.activitiesPlanned ?? 'Caricamento...'}
          />
        </div>

        <div className="col-span-12 lg:col-span-12 xl:col-span-6">
          <ActivityDashTable datas={kpi_dashboard_info?.activitiesCloseToEnd} />
        </div>
        <div className="col-span-12 lg:col-span-12 xl:col-span-6">
          <OpportunityDashTable datas={kpi_dashboard_info?.latestOpportunities}/>
        </div>
      </div>
    </>
  );
};

export default Home;
