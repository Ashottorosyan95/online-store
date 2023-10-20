const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLUnionType } = require("graphql");
const User = require("../models/user");
const { signUp, signIn } = require("../controlers/AuthControler");
const { createBooks } = require("../controlers/BookControler");
const { checkIsAdmin } = require("../utils/authUtils");

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        password: { type: GraphQLString },
        avatar: { type: GraphQLString },
        accessToken: { type: GraphQLString },
        refreshToken: { type: GraphQLString },
        message: { type: GraphQLString },
        statusCode: { type: GraphQLInt },
    })
});

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLInt },
        ISBN: { type: GraphQLString },
        authorId: { type: GraphQLString },
        categories: { type: GraphQLString },
        pages: { type: GraphQLInt },
        publicationYear: { type: GraphQLInt },
        avatar: { type: GraphQLString },
        message: { type: GraphQLString },
        statusCode: { type: GraphQLInt },
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            args: { id: { type: GraphQLInt } },
            async resolve(parent, args) {
                const user = await User.find();
                return user;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
                password: { type: GraphQLString },
                avatar: { type: GraphQLString },
                message: { type: GraphQLString },
                statusCode: { type: GraphQLInt },
            },
            async resolve(parent, args) {
                const userData = await signUp(args);
                return userData;
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                accessToken: { type: GraphQLString },
                refreshToken: { type: GraphQLString },
                statusCode: { type: GraphQLInt },
            },
            async resolve(parent, args) {
                const userData = await signIn(args);
                return userData;
            }
        },
        createBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLInt },
                ISBN: { type: GraphQLString },
                authorId: { type: GraphQLString },
                publicationYear: { type: GraphQLInt },
                categories: { type: GraphQLString },
                pages: { type: GraphQLInt },
                avatar: { type: GraphQLString },
                message: { type: GraphQLString },
                statusCode: { type: GraphQLInt },
            },
            async resolve(parent, args, context) {
                console.log('ssssssssssssssssss', args);
                // if (context.currentUser && checkIsAdmin(context.currentUser)) {
                // }
                return createBooks(args);
            }
        },
    }
});

module.exports = {
    UserType,
    BookType,
    RootQuery,
    Mutation
};