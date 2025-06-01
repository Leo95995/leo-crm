import PageMeta from "../../components/common/PageMeta";
import UserMetaCard from "../../components/UserProfile/UserMetaCard";

const ProfiloUtente : React.FC= ()=>   {
  return (
    <>
      <PageMeta
        title="Leo CRM | Profilo"
        description="Profilo"
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        
        <div className="space-y-6">
          <UserMetaCard />
        </div>
      </div>
    </>
  );
}


export default ProfiloUtente