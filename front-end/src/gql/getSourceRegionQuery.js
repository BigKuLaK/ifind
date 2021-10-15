import { gql } from "apollo-boost";

const sourceRegionQuery = gql`
query SourceRegionQuery {
    sources {
        id
        name
        button_logo {
            url
        }
    }
    regions {
        id
        name
    }
}
`;

export default sourceRegionQuery;