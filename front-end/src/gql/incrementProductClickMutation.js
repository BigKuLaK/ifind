import { gql } from "apollo-boost";

const incrementProductClickMutation = gql`
mutation IncrementProductClicks($id: ID!) {
    addProductClick (id: $id) {
        clicks_count
        id
    }
}
`;
export default incrementProductClickMutation;