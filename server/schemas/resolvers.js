const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

module.exports = {
    Query: {
        // get a single user by either their id or their username
        me: async (parent, {  params }, user) => {
            try {
                
                const foundUser = await User.findOne({
                    $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
                });

                if (!foundUser) {
                    return { message: 'Error 400, Cannot find a user with this id!' };
                }

                return foundUser;

            } catch (error) {
                console.log(error);
                return { message: 'Error 400', error };
            }
        }

    },

    Mutation: {
        // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        addUser: async (parent, { username, email, password }) => {
            try {
                const user = await User.create({username, email, password});
                if (!user) {
                    return { message: 'Error 400, Something is wrong!' };
                }
                const token = signToken(user);
                return { token, user };
            } catch (error) {
                console.log(error);
                return { message: 'Error 400', error };
            }
        },
        // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        // {body} is destructured req.body
        login: async (parent, { email, password }) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    throw AuthenticationError;
                };

                const correctPw = await user.isCorrectPassword(password);

                if (!correctPw) {
                    throw AuthenticationError;
                }
                const token = signToken(user);
                return { token, user };
            } catch (error) {
                console.log(error);
                return { message: 'Error 400', error };
            }
        },
        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // user comes from `req.user` created in the auth middleware function
        saveBook: async (parent, {bookInput} , context) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookInput } },
                    { new: true, runValidators: true }
                );
                
                return updatedUser;
            } catch (error) {
                console.log(error);
                return { message: 'Error 400', error };
            }
        },
        removeBook: async (parent, { user, params }) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: params.bookId } } },
                    { new: true }
                );
                if (!updatedUser) {
                    return { message: "Couldn't find user with this id!" };
                }
                return updatedUser;
            } catch (error) {
                console.log(error);
                return { message: 'Error 400', error };
            }
        }
    }
}