import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { StoreHasFood } from "../entity/StoreHasFood"

export class StoreHasFoodController {

    private readonly storeHasFoodRepository = AppDataSource.getRepository(StoreHasFood)

    async all(req:Request, res: Response) {
        const { s, f } = req.query
        const withStore = req.query.ws === "true"
        const withFood = req.query.wf === "true"
        const relations = []
        if (withStore){
            relations.push("storeProfile", "storeProfile.user", "storeProfile.storeHasFood", "storeProfile.storeHasFood.foodLocal")
        }
        if (withFood){
            relations.push("foodLocal")
        }

        if (s && f) {
            if (typeof s !== 'string' || typeof f !== 'string'){
                res.status(400)
                return { message: 'Parámetro inválido.' }
            }
            const storeHasFoods = await this.storeHasFoodRepository.find({
                where: {storeId: s, foodLocalId: f},
                relations: relations
            })
            return storeHasFoods
        } else if (s) {
            if (typeof s !== 'string'){
                res.status(400)
                return { message: 'Parámetro inválido.' }
            }
            const storeHasFoods = await this.storeHasFoodRepository.find({
                where: {storeId: s},
                relations: relations
            })
            return storeHasFoods
        } else if (f) {
            if (typeof f !== 'string'){
                res.status(400)
                return { message: 'Parámetro inválido.' }
            }
            const storeHasFoods = await this.storeHasFoodRepository.find({
                where: {foodLocalId: f},
                relations: relations
            })
            return storeHasFoods
        }
        return this.storeHasFoodRepository.find({relations: relations})
    }

    async oneByStore(request: Request, response: Response, next: NextFunction) {
        const {storeId} = request.params
        const withStore = request.query.ws === "true"
        const withFood = request.query.wf === "true"
        if (!storeId){
            response.status(400)
            return {message: "Error: id inválida"}
        }
        const relations = []

        if (withStore){
            relations.push("storeProfile", "storeProfile.user")
        }

        if (withFood){
            relations.push("foodLocal")
        }

        const storeHasFood = await this.storeHasFoodRepository.findOne({
            where: { storeId },
            relations: relations
        })

        if (!storeHasFood) {
            response.status(404)
            return {message: "Error: registro no existe"}
        }
        return storeHasFood
    }

    async create(request: Request, response: Response) {
        const { storeId, foodLocalId, isAvailable } = request.body;
       
           
        const newStoreHasFood = Object.assign(new StoreHasFood(), {
            storeId,
            foodLocalId,
            isAvailable
        })

        const savedStoreHasFood = await this.storeHasFoodRepository.save(newStoreHasFood)
        return this.storeHasFoodRepository.findOne({where: {storeId:storeId, foodLocalId: foodLocalId}, relations: ["storeProfile", "storeProfile.user", "foodLocal"]})
        
    }
    async update(req: Request, res:Response) {
        const {id} = req.params
        if (!id){
            res.status(400)
            return {message: "Error: id inválida"}
        }
        const { foodLocalId, isAvailable } = req.body;
        const updatedStoreHasFood = await this.storeHasFoodRepository.update({storeId: id, foodLocalId: foodLocalId}, {isAvailable})
        if (updatedStoreHasFood.affected === 1){
            return this.storeHasFoodRepository.findOne({
                where: {storeId: id, foodLocalId: foodLocalId},
                relations: [
                    "storeProfile",
                    "storeProfile.user",
                    "foodLocal"
                ]
            })
        }
        res.status(500)
        return {message: "Error al actualizar perfil de tienda"}

        
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const {storeId, foodLocalId} = request.params

        if (!storeId || !foodLocalId){
            response.status(400)
            return {message: "Error: id inválida"}
        }

        let storeHasFoodToRemove = await this.storeHasFoodRepository.findOneBy({ storeId:storeId, foodLocalId:foodLocalId })
        
        if (!storeHasFoodToRemove) {
            response.status(404)
            return {message: "Error: Registro no encontrado"}
        }
        return this.storeHasFoodRepository.remove(storeHasFoodToRemove)
    }
}