import { gql } from "apollo-boost";

const pageBySlugQuery = gql`
query PageBySlugQuery ($slug: String!, $language: String) {
    pageBySlug (slug:$slug, language:$language) {
        slug
        data {
            title
            body
        }
    }
}
`;

export default pageBySlugQuery;