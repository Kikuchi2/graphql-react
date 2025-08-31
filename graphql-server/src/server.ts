import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
type Context = {
    prisma: PrismaClient
}


const typeDefs = gql`
    type Todo {
        id: ID!
        title: String!
        date: String!
        completed: Boolean! 
    }

    type Query {
        getAllTodos: [Todo!]!
        getTodos(date: String!): [Todo!]!
    }

    type Mutation {
        addTodo(title: String!, date: String!): Todo!
        updateTodo(id: ID!, completed: Boolean!): Todo!
        deleteTodo(id: ID!): Todo!
    }
`;


const resolvers = {
    Query: {
        getAllTodos: async (_: unknown, __: any, context: Context) => {
            return await context.prisma.todo.findMany();
        },        
        getTodos: async (_: unknown, { date }: { date: string }, context: Context) => {
            return await context.prisma.todo.findMany({
                where: { 
                    date: String(date)
                }
            });
        },
    },
    Mutation: {
        addTodo: (_: unknown, { title, date }: { title: string, date: string }, context: Context) => {
            // let today = new Date();
            // let formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

            return context.prisma.todo.create({
                data: {
                    title,
                    date: date,
                    completed: false
                }
            })
        },
        updateTodo: (_: unknown, { id, completed }: { id: string, completed: boolean }, context: Context) => {
            return context.prisma.todo.update({
                where: { id },
                data: { completed }
            })
        },
        deleteTodo: (_: unknown, { id }: { id: string }, context: Context) => {
            return context.prisma.todo.delete({
                where: { id }
            })
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (): Context => ({ prisma })
});

server.listen().then(({ url }) => {
    console.log(`Server ready ad ${url}`);
});

