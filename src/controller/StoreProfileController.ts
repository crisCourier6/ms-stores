import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User";
import { StoreProfile } from "../entity/StoreProfile";
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import "dotenv/config"
import axios from "axios"

export class StoreProfileController {

    private storeProfileRepository = AppDataSource.getRepository(StoreProfile)

    async create(req: any) {
        const createdStoreProfile = await this.storeProfileRepository.save(req)
        return this.storeProfileRepository.findOne({where: {id: createdStoreProfile.id}, relations:["user"]})
    }
    async update(req: any) {
        const {id, user, ...storeProfile} = req
        if (!id) {
            return "id inválida"
        }
       return this.storeProfileRepository.update(id, storeProfile)
    }
    async remove(id:string) {
        let storeProfileToRemove = await this.storeProfileRepository.findOne({where: {id: id}})
        if (storeProfileToRemove){
            return this.storeProfileRepository.remove(storeProfileToRemove)
        }
        else{
            return "el perfil de tienda no existe"
        }
        
    }

    async all(req:Request, res: Response) {
        const { s, f } = req.query
        const withUser = req.query.wu === "true"
        const withCatalogue = req.query.wc === "true"
        const onlyActive = req.query.onlyactive === "true"
        const relations = []
        if (withUser){
            relations.push("user")
        }
        if (withCatalogue){
            relations.push("storeHasFood", "storeHasFood.foodLocal")
        }

        if (s) {
            if (typeof s !== 'string'){
                res.status(400)
                return { message: 'Parámetro inválido.' }
            }
            const queryBuilder = this.storeProfileRepository.createQueryBuilder("store");

            if (onlyActive) {
                queryBuilder.leftJoinAndSelect("store.user", "user")
                            .where("user.isActive = :isActive", { isActive: true });
            }

            const storeHasFoods = await queryBuilder
                .leftJoinAndSelect("store.storeHasFood", "storeHasFood")
                .leftJoinAndSelect("storeHasFood.foodLocal", "foodLocal")
                .where("store.id = :storeId", { storeId: s })
                .getMany();

            return storeHasFoods;
        }

        if (f) {
            console.log(f)
            if (typeof f !== 'string') {
                res.status(400);
                return { message: 'Parámetro inválido.' };
            }
            const queryBuilder = this.storeProfileRepository.createQueryBuilder("store")
                .leftJoinAndSelect("store.storeHasFood", "storeHasFood")
                .leftJoinAndSelect("storeHasFood.foodLocal", "foodLocal")
                .leftJoinAndSelect("store.user", "user");

            // If onlyActive is true, filter stores by active users
            if (onlyActive) {
                queryBuilder.where("user.isActive = :isActive", { isActive: true });
            }

            // Filter stores that have at least one matching storeHasFood with the given foodLocalId
            const storesWithFood = await queryBuilder
                .where(qb => {
                    const subQuery = qb.subQuery()
                        .select("storeHasFood.storeId")
                        .from("store_has_food", "storeHasFood")
                        .where("storeHasFood.foodLocalId = :foodLocalId")
                        .getQuery();
                    return `store.id IN ${subQuery}`;
                })
                .setParameter("foodLocalId", f)
                .getMany();

            return storesWithFood;
        }

        const queryBuilder = this.storeProfileRepository.createQueryBuilder("store");

        if (onlyActive) {
            queryBuilder.leftJoinAndSelect("store.user", "user")
                        .where("user.isActive = :isActive", { isActive: true });
        }

        return queryBuilder
            .leftJoinAndSelect("store.storeHasFood", "storeHasFood")
            .leftJoinAndSelect("storeHasFood.foodLocal", "foodLocal")
            .getMany();
    }


    async one(id: string, res: Response) {
  
        const storeProfile = await this.storeProfileRepository.findOne({
            where: { id: id },
            relations: ["user", "storeHasFood"]
        })

        if (!storeProfile) {
            res.status(404)
            return {message:"Tienda no encontrada"}
        }
        return storeProfile
    }

    async oneByUserId(id: string, res: Response) {
  
        const storeProfile = await this.storeProfileRepository.findOne({
            where: { userId: id },
            relations: ["user", "storeHasFood"]
        })

        if (!storeProfile) {
            res.status(404)
            return {message:"Tienda no encontrada"}
        }
        return storeProfile
    }

}