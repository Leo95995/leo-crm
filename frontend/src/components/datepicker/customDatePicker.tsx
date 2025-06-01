import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

interface ICustomDate {
  onClick?: (val: any) => any;
  minDate?: Date;
}

const CustomDateInput: React.FC<ICustomDate> = ({ onClick, minDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy");
      onClick && onClick(formattedDate);
    }
  };

  return (
    <div className="flex-col flex">
      <DatePicker
        showIcon={true}
        required={true}
        selected={selectedDate}
        onChange={handleChange}
        locale={"it"}
        minDate={minDate ?? new Date()}
        dateFormat="dd/MM/yyyy"
        className="h-11 w-full border-gray-300 dark:border-gray-700 rounded-lg border px-4 py-2.5 text-sm z-9999"
        placeholderText="Inserisci una data"
        icon={<CalendarTodayIcon className="absolute right-4" />}
      />
    </div>
  );
};

export default CustomDateInput;
