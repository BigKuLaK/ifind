import RatingWarps from "@components/RatingWarps";

import "./styles.module.scss";

const AttributesTable = ({ attributes }: AttributesTableProps) => {
  return (
    <table className="attributes-table">
      <thead>
        <tr>
          <th>Attribute</th>
          <th colSpan={2}>Rating</th>
          <th>Factor</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {attributes
          .filter((attributeRating) => attributeRating?.enabled)
          .map((attribute, index: number) => (
            <tr key={attribute?.product_attribute?.name}>
              <td>
                <strong>{attribute?.product_attribute?.name}</strong>
              </td>
              <td>{attribute?.rating}</td>
              <td>
                <RatingWarps rating={attribute?.rating || 0} />
              </td>
              <td>{attribute?.factor}</td>
              <td>{attribute?.points}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default AttributesTable;
