module.exports = `
    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookInput: BookInput!): User 
        removeBook(bookId: String!): User
    }

    input BookInput {
        authors: [String]
        description: String
        title: String
        bookId: String
        image: String
        link: String
      }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        authors: [String]
        description: String
        title: String
        bookId: ID
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }
`