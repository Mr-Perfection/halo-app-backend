import people from "./dataset"; //get all of the available data from our database.
const Resolvers = {
  Query: {
    getAllPeople: () => people, //if the user runs the getAllPeople command
    //if the user runs the getPerson command:
    getPerson: (_: any, args: any) => { 
      console.log(args);
      //get the object that contains the specified ID.
      return people.find((person) => person.id === args.id);
    },
  },
  Mutation: {
    //create our mutation:
    addPerson: (_: any, args: any) => {
      const newPerson = {
        id: people.length + 1, //id field
        name: args.name, //name field
      };
      people.push(newPerson);
      return newPerson; //return the new object's result
    },
  }
};
export default Resolvers;