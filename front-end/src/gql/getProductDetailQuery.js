import { gql } from "apollo-boost";

const getProductDetailQuery = gql`
query GetProductDetailQuery ($id: ID!, $language:String) {
    productDetails ( id: $id, language: $language ) {
        amazon_url
        price
        details_html
        release_date
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
        attrs_rating {
            id
            product_attribute {
                id
                name
                custom_formula
                data_type
                disable_min
                disable_max
                max_label
                min_label
                product_prop
            }
            rating
            points
            enabled
            use_custom_formula
            min
            max
            factor
        }
        final_rating
        product_changes {
            state
            date_time
        }
    }
}
`;

export default getProductDetailQuery;