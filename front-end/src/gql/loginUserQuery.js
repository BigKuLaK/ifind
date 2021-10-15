import { gql } from "apollo-boost";

const loginUserQuery = gql`
    mutation LoginUserQuery ($username: String!, $password: String!) {
        login(input: { identifier: $username, password: $password }) {
            jwt
        }
    }
`;

export default loginUserQuery;