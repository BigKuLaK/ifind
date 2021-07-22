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
            order
        }
        products {
            id
            title
            amazon_url
            price
            image
            details_html
            final_rating
            attrs_rating {
                points
                product_attribute {
                    name
                }
                rating
                factor
            }
            product_changes {
                state
                date_time
            }
            url_list {
                source {
                    id
                    button_logo {
                        url
                    }
                }
                region {
                    id
                    currency {
                        symbol
                    }
                }
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