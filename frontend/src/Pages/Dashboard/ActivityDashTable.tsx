import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/table";
import { ActivityInfo } from "../../Pages/Authorized/Utenti/userTableConfig";
import { IActivity } from "../../interfaces/opportunities";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router";
import EmptyList from "../../components/empty/emptyList";
import ListAltIcon from "@mui/icons-material/ListAlt";

import { getActivityBadgeState } from "../../Utils/options";
import Badge from "../../components/badge/Badge";

// Redux Functions
import { setInternalLoad } from "../../store/appStore";
import CustomLoader from "../../components/Loader/CustomLoader";
import { useEffect } from "react";

interface IActivityWithOpportunity {
  _id: string;
  name: string;
  activities: IActivity;
}

interface IActivityDashTable {
  datas: IActivityWithOpportunity[];
}

const ActivityDashTable: React.FC<IActivityDashTable> = ({ datas }) => {
  const internalLoad = useSelector((state: any) => state.app.internalLoad);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setInternalLoad(true));
    setTimeout(() => {
      dispatch(setInternalLoad(false));
    }, 1000);
  }, []);

  return (
    <>
      <div className="overflow-hidden rounded-xl border h-full sm:min-h-132 border-gray200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="p-5 text-xl flex items-center font-bold border-b-1 h-22 w-full  dark:border-gray-700 dark:text-white">
            Prime 5 Attività in scadenza
          </div>
          <Table>
            <TableHeader
              className={`border-b  dark:border-white/[0.05] w-full  `}
            >
              <TableRow>
                {datas?.length > 0 &&
                  !internalLoad &&
                  ActivityInfo.map((datum) => {
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
                  icon={<ListAltIcon style={{ fontSize: "40px" }} />}
                  mainText={`Nessuna attività presente`}
                  secondaryText={`Aggiungine una dalla sezione opportunità`}
                  onClick={() => navigate("/opportunita")}
                  buttonText={`Vai alle opportunità`}
                />
              </div>
            )}
            {internalLoad && (
              <div className="h-100 flex-1 flex justify-center items-center">
                {" "}
                <CustomLoader />{" "}
              </div>
            )}
            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 h-full dark:divide-white/[0.05]">
              {!internalLoad &&
                datas?.length > 0 &&
                datas?.map((data) => {
                  const { activities } = data;

                  return (
                    <TableRow key={activities?._id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {activities?.description}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <b>{activities?.date.split("T")[0]}</b>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex -space-x-2">
                          <Badge
                            color={getActivityBadgeState(activities?.status)}
                          >
                            {activities?.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex -space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              sessionStorage.setItem(
                                "selectedOpportunity",
                                data?._id
                              );
                              navigate("/opportunita");
                            }}
                            variant="primary"
                          >
                            Visualizza
                          </Button>
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
export default ActivityDashTable;
