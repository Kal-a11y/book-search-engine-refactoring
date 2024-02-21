import { gql } from '@apollo/client';

export const GET_ME = gql`
    query singleUser {
        me {
            _id
            usernameemail
            bookCound
            savedBooks
        }
    }
`;