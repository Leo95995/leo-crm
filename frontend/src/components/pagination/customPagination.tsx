import {  Pagination } from "@mui/material";
import { useEffect, useState } from "react";

interface IPagination {
  totalResults: number;
  pageSize: number;
  handleChangePage: (any?: any) => any;
  currentPage: number
}



const CustomPagination: React.FC<IPagination> = ({
  totalResults,
  pageSize,
  handleChangePage,
  currentPage
}) => {
  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  useEffect(() => {
    if (pageSize > 0 && totalResults >= 0) {
      setNumberOfPages(Math.ceil(totalResults / pageSize));
    }
  }, [totalResults]);

  return (
    <div className="w-full justify-center flex p-2 border dark:text-white dark:bg-blue-200 ">
      <Pagination
        onChange={(_, page) => handleChangePage(page)}
        page={currentPage}
        className="dark:text-white text-white flex gap-0"
        hideNextButton
        hidePrevButton
        shape="rounded"
        sx={{
          "& .Mui-selected": {
            backgroundColor: "darkgray",
          },
          "& .MuiPaginationItem-root": {
            color: "black",
          },
        }}
        count={numberOfPages || 1}
      ></Pagination>
    </div>
  );
};

export default CustomPagination;
