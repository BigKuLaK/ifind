import { gql } from "apollo-boost";

const getProductComparisonList = gql`
    query ProductComparisonList {
        productComparisonList(language: "en") {
        category {
            id
            label {
                id
                label
            }
        }
        products {
            id
            title
            image
            url_list {
                source {
                    id
                    button_logo {
                        url
                    }
                }
                region { id }
                url
                price
                is_base
            }
            categories {
            label {
                label
                language {
                        id
                        name
                    }
                }
            }
        }
        }
    }
`;

export default getProductComparisonList;