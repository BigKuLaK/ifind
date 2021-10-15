import React, { ReactNode } from 'react';

export type T_Column = {
  property: string
  content?: JSX.Element|string
};

export interface I_RowProps {
  columns: Array<T_Column>
  className?: string
}

export type T_Row = (props: I_RowProps) => JSX.Element;

const Row : T_Row = ({ columns = [], className = '' }) => {
  return (
    <tr className={[ 'table-row', className ].join(' ')}>
      {columns.map(column => (
        <td className={`table-column--${column.property}`}>{column.content}</td>
      ))}
    </tr>
  );
}

export default Row;