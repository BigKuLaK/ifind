import { gql } from "apollo-boost";
import bestSellers from './query-parts/bestSellers';

const homepageQuery = gql`
    query HomepageQuery {
        ${bestSellers('computers')}
    }
`;

export default homepageQuery;