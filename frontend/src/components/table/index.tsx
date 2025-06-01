import { ReactNode } from "react";

// Interfacce per le table

interface TableProps {
  children: ReactNode; 
  className?: string; 
}

interface TableHeaderProps {
  children: ReactNode; 
  className?: string; 
}


interface TableBodyProps {
  children: ReactNode; 
  className?: string; 
}


interface TableRowProps {
  children: ReactNode; 
  className?: string; 
}


interface TableCellProps {
  children: ReactNode; 
  isHeader?: boolean;
  className?: string; 
}

// Componente Table
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// Header della table
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// Body Table
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// Riga della table
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// Cella table
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={` ${className}`}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
