import { gql } from "apollo-boost";

const generateParentCategoryFragment = (iterationsLeft) => (iterationsLeft && `
    parent {
        id
        label {
            label
        }
        ${generateParentCategoryFragment(--iterationsLeft)}
    }
`) || '';

const generateChildCategory = (iterationsLeft) => {
    return `
        id
        icon
        order
        label {
            label
        }
        ${generateParentCategoryFragment(10)}
        ${(iterationsLeft &&
            `
                children {
                    ${generateChildCategory(--iterationsLeft)}
                }
            `) || ''
        }
    `
}

const getCategoryTree = gql`
query GetCategoryTree($language: String) {
    categoryTree (language: $language) {
        ${generateChildCategory(5)}
    }
}
`;

export default getCategoryTree;