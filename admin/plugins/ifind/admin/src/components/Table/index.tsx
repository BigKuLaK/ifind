import React, { ReactNode, useCallback } from "react";
import Row, { T_Column, I_RowProps } from "./row";

export type T_ColumnHeader = {
  [key: string]: ReactNode|string
};

export type T_GenericRowData = { [key: string]: any };

export interface I_TableProps {
  headers?: T_ColumnHeader;
  rows?: Array<T_GenericRowData>;
  className?: string;
}

export type T_Table = (props: I_TableProps) => JSX.Element;

const Table: T_Table = ({ headers = {}, rows = [], className = "" }: I_TableProps) => {
  type T_RowDataToColumnsCallback = (rowData: T_GenericRowData) => T_Column[];

  const classes = ["table", className].join(" ");

  const rowDataToColumns = useCallback<T_RowDataToColumnsCallback>((rowData) => {
    const columns = Object.keys(headers).reduce(
      (all, property) => {
        all.push({
          property,
          content: rowData[property]
        });
        return all;
      },
      [] as T_Column[]
    );

    return columns;
  }, []);

  const columnHeaders = Object.entries(headers).map(([ property,label ]) => (
    <th>{label}</th>
  ));

  return (
    <table className={classes}>
      <thead>
        <tr>
          {columnHeaders}
        </tr>
      </thead>
      <tbody>{rows.map((rowData) => (
        <Row
          columns={rowDataToColumns(rowData)}
        />
      ))}</tbody>
    </table>
  );
};

export default Table;
