import * as React from "react";
import useAutocomplete from "@mui/material/useAutocomplete";
import { styled } from "@mui/system";
const Input = styled("input")(({}) => ({
}));

const Listbox = styled("ul")(({ theme }) => ({
  width: "600px",
  margin: 0,
  padding: 0,
  zIndex: 99999,
  position: "absolute",
  listStyle: "none",
  backgroundColor: "#fff",
  overflow: "auto",
  border: "1px solid rgba(0,0,0,.25)",
  "& li.Mui-focused": {
    backgroundColor: "#4a8df6",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#2977f5",
    color: "white",
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "#000",
  }),
}));

interface Option {
  value: string;
  label: string;
}

interface ISelectAutoComplete {
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string
}

const SelectAutocomplete: React.FC<ISelectAutoComplete> = ({
  options,
  onChange,
  placeholder
}) => {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: options,
    getOptionLabel: (option) => option.label,
  });

  const findOptionOnSend = (name: string) => {
    const toSet = options.find((option) => option.label === name);
    if (toSet) onChange(toSet.value);
  };

  return (
    <div className="w-full">
      <div className="w-full" {...getRootProps()}>
        <Input
          placeholder={placeholder ?? `Seleziona un opzione`}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              findOptionOnSend(e.currentTarget.value);
            }
          }}
          type="search"
          className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          {...getInputProps()}
        />
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox
          className="w-full appearance-none rounded-lg border  bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          {...getListboxProps()}
        >
          {groupedOptions.map((option, index) => {
            const { key, ...optionProps } = getOptionProps({ option, index });
            return (
              <div
                className="cursor-pointer"
                onClick={() => onChange(option.value)}
              >
                <li
                  className="h-7 p-2 flex items-center border-0 w-full appearance-none  border bg-transparent px-4  pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  key={key}
                  {...optionProps}
                >
                  {option.label}
                </li>
              </div>
            );
          })}
        </Listbox>
      ) : null}
    </div>
  );
};

export default SelectAutocomplete;
