import { gql } from "apollo-server-express"; //will create a schema

const Schema = gql`
  type Person {
    id: ID!
    name: String
  }
  #handle user commands
  type Query {
    getAllPeople: [Person]
    getPerson(id: Int): Person 
  }

  type Mutation {
    #the addPerson commmand will accept an argument of type String.
    #it will return a 'Person' instance. 
    addPerson(name: String): Person
  }
`;
export default Schema; 
//export this Schema so we can use it in our project