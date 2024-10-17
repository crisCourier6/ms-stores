import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User";
import { StoreProfile } from "../entity/StoreProfile";
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import "dotenv/config"
import axios from "axios"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private storeProfileRepository = AppDataSource.getRepository(StoreProfile)

    async create(req: any) {
        const createdUser = await this.userRepository.save(req)
        if (req.storeProfile){
            const createdStoreProfile = await this.storeProfileRepository.save(req.storeProfile)
        }
        return this.userRepository.findOne({where: {id: createdUser.id}, relations:["storeProfile"]})
    }
    async update(req: any) {
        const {id, storeProfile, expertProfile, userHasRole, ...user } = req
        if (!id) {
            return "id inválida"
        }
       return this.userRepository.update(id, user)
    }
    async remove(id:string) {
        let userToRemove = await this.userRepository.findOne({where: {id: id}})
        if (userToRemove){
            return this.userRepository.remove(userToRemove)
        }
        else{
            return "el usuario no existe"
        }
        
    }

}