import { NextFunction, Request, Response } from "express"
import { Channel } from "amqplib"
import "dotenv/config"
import { StoreHasFoodController } from "./StoreHasFoodController"
import { StoreProfileController } from "./StoreProfileController"

export class MainController{

    private readonly storeHasFoodController = new StoreHasFoodController
    private readonly storeProfileController = new StoreProfileController
    // user rates expert

    // storeHasFoodAll() retorna todos los diarios alimenticios
    async storeHasFoodAll(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.storeHasFoodController.all(req, res)  
    }

    // storeHasFoodOne() retorna el diario alimenticio con la id indicada
    async storeHasFoodOneByStore(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.storeHasFoodController.oneByStore(req, res, next)
    }
    // storeHasFoodSave() crea un diario nuevo con los datos provenientes en la request y lo retorna
    async storeHasFoodSave(req: Request, res: Response, next: NextFunction, channel: Channel) {
       return this.storeHasFoodController.create(req, res)
    }

    // storeHasFoodUpdate() modifica los datos de un diario y retorna el resultado
    async storeHasFoodUpdate(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.storeHasFoodController.update(req, res)
    }
    // storeHasFoodRemove() elimina el diario con el id indicado en los parámetros de la uri
    async storeHasFoodRemove(req: Request, res: Response, next: NextFunction, channel: Channel){
        return this.storeHasFoodController.remove(req, res, next)
    }

    async storesAll(req: Request, res: Response, next: NextFunction, channel: Channel) {
        return this.storeProfileController.all(req, res)
    }

    async storesOne(req: Request, res: Response, next: NextFunction, channel: Channel){
        return this.storeProfileController.one(req.params.id, res)
    }

    async storesOneByUserId(req: Request, res: Response, next: NextFunction, channel: Channel){
        return this.storeProfileController.oneByUserId(req.params.id, res)
    }
}