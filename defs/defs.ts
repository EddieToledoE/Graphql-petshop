export const typeDefs = `
type Pet {
    id: ID
    name: String
    type: String
    age: Int
    owner: String
    count: Int
}

type Owner {
  id: ID
  name: String
  city: String
  pets: [ID]
  count: Int
}
type PetsPage {
    pets: [Pet]
    pageInfo: PageInfo
  }

  type OwnersPage {
    owners: [Owner]
    pageInfo: PageInfo
  }
  
  type PageInfo {
    currentPage: Int
    pageSize: Int
    totalPages: Int
    totalCount: Int
  }

type Query {
  pets(page: Int, pageSize: Int): PetsPage
  pet(id: ID!): Pet
  owners(page: Int, pageSize: Int): OwnersPage
  owner(id: ID!): Owner
  countPetsperOwner: [Owner]
  countPetsperType: [Pet]
  countPetsperCity: [Owner]
}

input PetInput{
    id: ID
    name: String
    type: String
    age: Int
    owner: String
}

input OwnerInput{
    id: ID
    name: String
    city: String
    pets: [String]
    }

type Mutation {
    addPet(pet: PetInput): Pet
    addOwner(owner: OwnerInput): Owner
    deletePet(id: ID!): Pet
    deleteOwner(id: ID!): Owner
    updatePet(id: ID!, name: String, type: String, age: Int): Pet
    updateOwner(id: ID!, name: String, city: String): Owner
    addPetToOwner(petId: ID!, ownerId: ID!): Owner
    removePetFromOwner(petId: ID!, ownerId: ID!): Owner
}
`;
