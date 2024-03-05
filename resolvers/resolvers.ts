import petsModels from "../models/pets.models";
import ownersModels from "../models/owners.models";
import User from "../models/User";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import webhooksModels from "../models/webhooks.models";
import { WebhookController } from "./webhookcontroller";
export const resolvers = {
  Query: {
    pets: async (_: any, { page = 1, pageSize = 10 }: any) => {
      try {
        const skip = (page - 1) * pageSize;
        const pets = await petsModels.find().skip(skip).limit(pageSize);
        const totalCount = await petsModels.countDocuments();
        return {
          pets,
          pageInfo: {
            currentPage: page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            totalCount,
          },
        };
      } catch (error) {
        console.error("Error fetching pets:", error);
        return null;
      }
    },
    pet: async (root: any, args: { id: string }) => {
      try {
        const pet = await petsModels.findById(args.id);
        return pet;
      } catch (error) {
        console.error("Error fetching pet:", error);
        return null;
      }
    },
    owners: async (_: any, { page = 1, pageSize = 10 }: any) => {
      try {
        const skip = (page - 1) * pageSize;
        const owners = await ownersModels.find().skip(skip).limit(pageSize);
        const totalCount = await ownersModels.countDocuments();
        return {
          owners,
          pageInfo: {
            currentPage: page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            totalCount,
          },
        };
      } catch (error) {
        console.error("Error fetching owners:", error);
        return null;
      }
    },
    owner: async (root: any, args: { id: string }) => {
      try {
        const owner = await ownersModels.findById(args.id);
        return owner;
      } catch (error) {
        console.error("Error fetching owner:", error);
        return null;
      }
    },
    countPetsperOwner: async () => {
      try {
        const owners = await ownersModels.find().populate("pets");
        const result = owners.map((owner: any) => ({
          id: owner.id,
          name: owner.name,
          city: owner.city,
          count: owner.pets.length,
        }));
        console.log("Count Pets per Owner:", result); // Imprimir en consola
        return result;
      } catch (error) {
        console.error("Error counting pets per owner:", error);
        return null;
      }
    },
    countPetsperCity: async () => {
      try {
        const owners = await ownersModels.find();
        const count = owners.reduce((acc: any, owner: any) => {
          acc[owner.city] = (acc[owner.city] || 0) + owner.pets.length;
          return acc;
        }, {});
        const result = Object.keys(count).map((city) => ({
          city,
          count: count[city],
        }));
        console.log("Count Pets per City:", result); // Imprimir en consola
        return result;
      } catch (error) {
        console.error("Error counting pets per city:", error);
        return null;
      }
    },

    countPetsperType: async () => {
      try {
        const pets = await petsModels.find();
        const count = pets.reduce((acc: any, pet: any) => {
          acc[pet.type] = acc[pet.type] || { type: pet.type, count: 0 };
          acc[pet.type].count += 1;
          return acc;
        }, {});
        const result = Object.values(count);
        console.log(result); // Agregar esta línea para imprimir el resultado en la consola
        return result;
      } catch (error) {
        console.error("Error counting pets per type:", error);
        return null;
      }
    },
    users: async () => {
      try {
        const res = await User.find();
        console.log(res);
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    user: async (_: void, args: any) => {
      try {
        const userId = args.id;
        const res = await User.findById(userId);
        console.log(res);

        return res;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    addPet: async (root: any, args: { pet: any }) => {
      try {
        const newPet = new petsModels(args.pet);
        const savedPet = await newPet.save();
        await WebhookController("addPet", savedPet);
        return savedPet;
      } catch (error) {
        console.error("Error adding pet:", error);
        return null;
      }
    },
    addOwner: async (root: any, args: { owner: any }) => {
      try {
        const newOwner = new ownersModels(args.owner);
        const savedOwner = await newOwner.save();
        await WebhookController("addOwner", savedOwner);
        return savedOwner;
      } catch (error) {
        console.error("Error adding owner:", error);
        return null;
      }
    },
    deletePet: async (root: any, args: { id: string }) => {
      try {
        const deletedPet = await petsModels.findByIdAndDelete(args.id);
        return deletedPet;
      } catch (error) {
        console.error("Error deleting pet:", error);
        return null;
      }
    },
    deleteOwner: async (root: any, args: { id: string }) => {
      try {
        const deletedOwner = await ownersModels.findByIdAndDelete(args.id);
        return deletedOwner;
      } catch (error) {
        console.error("Error deleting owner:", error);
        return null;
      }
    },
    updatePet: async (
      root: any,
      args: { id: string; name: string; type: string; age: number }
    ) => {
      try {
        const updatedPet = await petsModels.findByIdAndUpdate(
          args.id,
          { name: args.name, type: args.type, age: args.age },
          { new: true }
        );
        return updatedPet;
      } catch (error) {
        console.error("Error updating pet:", error);
        return null;
      }
    },
    updateOwner: async (
      root: any,
      args: { id: string; name: string; city: string }
    ) => {
      try {
        const updatedOwner = await ownersModels.findByIdAndUpdate(
          args.id,
          { name: args.name, city: args.city },
          { new: true }
        );
        return updatedOwner;
      } catch (error) {
        console.error("Error updating owner:", error);
        return null;
      }
    },
    addPetToOwner: async (
      root: any,
      args: { petId: string; ownerId: string }
    ) => {
      try {
        const owner = await ownersModels.findById(args.ownerId);
        const pet = await petsModels.findById(args.petId);
        owner.pets.push(pet);
        await owner.save();
        return owner;
      } catch (error) {
        console.error("Error adding pet to owner:", error);
        return null;
      }
    },
    removePetFromOwner: async (
      root: any,
      args: { petId: string; ownerId: string }
    ) => {
      try {
        const owner = await ownersModels.findById(args.ownerId);
        owner.pets = owner.pets.filter(
          (pet: any) => pet.toString() !== args.petId
        );
        await owner.save();
        return owner;
      } catch (error) {
        console.error("Error removing pet from owner:", error);
        return null;
      }
    },
    receiveDiscordWebhookEvent: async (
      _parent: any,
      args: { url: any; events: any }
    ) => {
      const { url, events } = args;
      const createdWebhook = new webhooksModels({
        url,
        event: events,
      });
      const res = await createdWebhook.save();
      console.log(res);
      return res;
    },
    registerUser: async (_: void, args: any) => {
      try {
        const user = new User({
          name: args.name,
          email: args.email,
          password: args.password,
        });
        const res = await user.save();
        console.log(res);

        return res;
      } catch (error) {
        console.log(error);
      }
    },
    logInUser: async (_: void, args: any) => {
      try {
        const user = await User.findOne({ email: args.email }).select(
          "+password"
        );
        console.log(user);
        if (!user || user.password !== args.password)
          throw new Error("Credenciales invalidas");
        const token = generateToken(user);
        console.log(token);
        return token;
      } catch (error) {
        console.log(error);
        return "Credendenciales invalidas";
      }
    },
  },
};

const generateToken = (user: any) => {
  return jwt.sign({ user }, "secretito123", { expiresIn: "1h" });
};
