import { gql } from "apollo-boost";

const globalDataQuery = gql`
query GlobalDataQuery ($language: String) {
    footerSettingsByLanguage (language: $language) {
        footer_links {
            label
            page {
                slug
            }
        }
        footer_text
        footer_footnote
    }
    socialNetwork {
        social_network {
          url
          type
        }
      }
      contactDetail {
        phone_number
        email
      }
}
`;

export default globalDataQuery;