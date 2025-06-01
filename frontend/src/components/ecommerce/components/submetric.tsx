import { ReactNode } from "react";

interface ISubMetric {
    icon: ReactNode
    submetricData : {title: ReactNode , data: ReactNode}
}

const Crm_SubMetric: React.FC<ISubMetric> = ({icon, submetricData}) => {

    const { title, data } = submetricData

  return (
    <>
      {" "}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-200">
            {icon}
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-md font-medium text-gray-500 dark:text-gray-200">
              {title  ?? "Customers"}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data ?? "Nessun valore disponibile"}
            </h4>
          </div>
      
        </div>
      </div>
    </>
  );
};

export default Crm_SubMetric;
