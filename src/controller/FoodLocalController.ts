import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User";
import { FoodLocal } from "../entity/FoodLocal";
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import "dotenv/config"
import axios from "axios"

export class FoodLocalController {

    private foodLocalRepository = AppDataSource.getRepository(FoodLocal)

    async create(req: any) {
        const createdFoodLocal = await this.foodLocalRepository.save(req)
        return this.foodLocalRepository.findOne({where: {id: createdFoodLocal.id}})
    }
    async update(req: any) {
        const {id, ...foodLocal} = req
        if (!id) {
            return "id inválida"
        }
       return this.foodLocalRepository.update(id, foodLocal)
    }
    async remove(id:string) {
        let foodLocalToRemove = await this.foodLocalRepository.findOne({where: {id: id}})
        if (foodLocalToRemove){
            return this.foodLocalRepository.remove(foodLocalToRemove)
        }
        else{
            return "el alimento no existe"
        }
        
    }

    async saveSimple(req: any) {
        return this.foodLocalRepository.save(req)
     }

}