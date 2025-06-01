import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/table";
import { OpportunityInfoDashBoard } from "../../Pages/Authorized/Utenti/userTableConfig";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router";
import { IActivity } from "../../interfaces/opportunities";
import EmptyList from "../../components/empty/emptyList";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Badge from "../../components/badge/Badge";
import { getOpportunityBadgeState } from "../../Utils/options";

import CustomLoader from "../../components/Loader/CustomLoader";

interface Opportunity {
  _id: string;
  name: string;
  value: number;
  stage: string;
  contact_id: string;
  user_id: string;
  createdAt: string;
  __v: number;
  activities: IActivity[];
}

interface IOpportunityDashTable {
  datas: Opportunity[];
}

const OpportunityDashTable: React.FC<IOpportunityDashTable> = ({ datas }) => {
  const internalLoad = useSelector((state: any) => state.app.internalLoad);
  const navigate = useNavigate();

  return (
    <>
      <div className="overflow-hidden rounded-xl border h-full border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="p-5 text-xl font-bold border-b-1 w-full flex items-center h-22 flex gap-5 items-center dark:text-gray-200">
            Ultime opportunità create
            <div className="flex -space-x-2">
              <Button
                size="sm"
                onClick={() => {
                  navigate("/opportunita");
                }}
                variant="primary"
              >
                Vedi tutte
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader
              className={`border-b border-gray-100 dark:border-white/[0.05] w-full `}
            >
              <TableRow>
                {datas?.length > 0 &&
                  !internalLoad &&
                  OpportunityInfoDashBoard.map((datum) => {
                    return (
                      <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        {datum}
                      </TableCell>
                    );
                  })}
              </TableRow>
            </TableHeader>
            {datas?.length < 1 && !internalLoad && (
              <div className="w-full flex-1 flex items-center justify-center h-100">
                <EmptyList
                  icon={<MonetizationOnIcon style={{ fontSize: "40px" }} />}
                  mainText={`Nessuna opportunità presente`}
                  secondaryText={`Aggiungine una`}
                  onClick={() => navigate("/opportunita")}
                  buttonText="Vai alla sezione"
                />
              </div>
            )}
            {internalLoad && (
              <div className="h-100 flex-1 flex justify-center items-center">
                <CustomLoader />
              </div>
            )}

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {datas?.length > 1 && ! internalLoad && datas?.map((data: Opportunity) => {
                const { _id, name, value, stage, createdAt } = data;

                return (
                  <TableRow key={_id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {value} €
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex -space-x-2">
                        {" "}
                        <Badge color={getOpportunityBadgeState(stage)}>
                          {" "}
                          {stage}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex -space-x-2">
                        <b>{createdAt.split("T")[0]}</b>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
export default OpportunityDashTable;
