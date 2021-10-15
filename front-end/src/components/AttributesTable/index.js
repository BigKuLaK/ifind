import './styles.scss';

import RatingWarps from '@components/RatingWarps';

import './styles.scss';

const AttributesTable = ({ attributes }) => {
    return (
        <table className="attributes-table">
            <thead>
                <tr>
                    <th>Attribute</th>
                    <th colSpan="2">Rating</th>
                    <th>Factor</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {attributes.map((attribute, index) => (
                    <tr key={attribute.product_attribute.name}>
                        <td><strong>{attribute.product_attribute.name}</strong></td>
                        <td>{attribute.rating}</td>
                        <td><RatingWarps rating={attribute.rating} /></td>
                        <td>{attribute.factor}</td>
                        <td>{attribute.points}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default AttributesTable;