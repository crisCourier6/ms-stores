import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import * as amqp from "amqplib/callback_api"
import { Channel } from "amqplib"
import "dotenv/config"
import { UserController } from "./controller/UserController"
import { StoreProfileController } from "./controller/StoreProfileController"
import { FoodLocalController } from "./controller/FoodLocalController"

AppDataSource.initialize().then(async () => {
    amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
        if(error0){
            throw error0
        }

        connection.createChannel(async (error1, channel)=>{
            if (error1){
                throw error1
            }

            const userController = new UserController
            const storeProfileController = new StoreProfileController
            const foodLocalController = new FoodLocalController

            channel.assertExchange("StoreProfile", "topic", {durable: false})

            channel.assertExchange("Accounts", "topic", {durable: false})
            channel.assertExchange("FoodProfile", "topic", {durable: false})
            channel.assertExchange("FoodEdit", "topic", {durable: false})

            channel.assertQueue("StoreProfile_Accounts", {durable: false})
            channel.bindQueue("StoreProfile_Accounts", "Accounts", "user.*")
            channel.bindQueue("StoreProfile_Accounts", "Accounts", "store.*")

            channel.assertQueue("StoreProfile_FoodLocal", {durable: false})
            channel.bindQueue("StoreProfile_FoodLocal", "FoodProfile", "food-local.*")

            channel.assertQueue("StoreProfile_FoodEdit", {durable: false})
            channel.bindQueue("StoreProfile_FoodEdit", "FoodEdit", "food-local.*")
            // create express app
            const app = express()
            app.use(bodyParser.json())

            // register express routes from defined application routes
            Routes.forEach(route => {
                (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
                    const result = (new (route.controller as any))[route.action](req, res, next)
                    if (result instanceof Promise) {
                        result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

                    } else if (result !== null && result !== undefined) {
                        res.json(result)
                    }
                })
            })

            channel.consume("StoreProfile_Accounts", async (msg)=>{
                let entity = msg.fields.routingKey.split(".")[0]
                let action = msg.fields.routingKey.split(".")[1]
                if (entity==="user"){
                    if (action=="create"){
                        let content = JSON.parse(msg.content.toString())
                        let trimmedContent = {...content, expertProfile:undefined, userHasRole:undefined}
                        await userController.create(trimmedContent)
                        .then(result=>{
                            console.log(result)
                        })
                        .catch(error=>console.log(error))
                    }
                    else if (action=="update"){
                        let content = JSON.parse(msg.content.toString())
                        let trimmedContent = {...content, expertProfile:undefined, userHasRole:undefined}
                        console.log("i should update the user with id: ", trimmedContent)
                        await userController.update(content)
                        .then(result=>{
                            console.log(result)
                        })
                        .catch(error=>console.log(error))
                    }
                    else if (action=="remove"){
                        let content = JSON.parse(msg.content.toString())
                        console.log("i should delete the user with id: ", content)
                        await userController.remove(content)
                        .then(result=>{
                            console.log(result)
                        })
                        .catch(error=>console.log(error))
                    }
                } else if (entity==="store"){
                    if (action=="create"){
                        let content = JSON.parse(msg.content.toString())
                        await storeProfileController.create(content)
                        .then(result=>{
                            console.log(result)
                        })
                        .catch(error=>console.log(error))
                    }
                    else if (action=="update"){
                        let content = JSON.parse(msg.content.toString())
                        console.log("i should update the store with id: ")
                        await storeProfileController.update(content)
                        .then(result=>{
                            console.log(result)
                        })
                        .catch(error=>console.log(error))
                    }
                    else if (action=="remove"){
                        let content = JSON.parse(msg.content.toString())
                        console.log("i should delete the store with id: ", content)
                        await storeProfileController.remove(content)
                        .then(result=>{
                            console.log(result)
                        })
                        .catch(error=>console.log(error))
                    }
                }
                
            }, {noAck: true})

            channel.consume("StoreProfile_FoodLocal", async (msg)=>{
                let action = msg.fields.routingKey.split(".")[1]
                if (action=="save"){
                    let content = JSON.parse(msg.content.toString())
                    console.log(content)
                    await foodLocalController.create(content)
                    .then(result=>{
                        console.log(result)
                    })
                    .catch(error=>console.log(error))
                }
                if (action=="update"){
                    let content = JSON.parse(msg.content.toString())
                    console.log("saving: ", content)
                    await foodLocalController.update(content)
                    .then(result=>{
                        console.log(result)
                    })
                }
                else if (action=="remove"){
                    let content = JSON.parse(msg.content.toString())
                    console.log("deleting: ", content.id)
                    await foodLocalController.remove(content)
                    .then(result=>{
                        console.log(result)
                    })
                }    
            }, {noAck: true})

            channel.consume("StoreProfile_FoodEdit", async (msg)=>{
                let action = msg.fields.routingKey.split(".")[1]
                if (action=="update"){
                    let content = JSON.parse(msg.content.toString())
                    console.log("saving: ", content)
                    await foodLocalController.update(content)
                    .then(result=>{
                        console.log(result)
                    })
                }
                else if (action === "new"){
                    let content = JSON.parse(msg.content.toString())
                    await foodLocalController.saveSimple(content)
                    .then(result=>{
                        console.log(result)
                    })
                }
            }, {noAck: true})

            // setup express app here
            // ...

            // start express server
            app.listen(process.env.PORT)

            console.log(`Express server has started on port ${process.env.PORT}. Open http://localhost:${process.env.PORT}/store-profile to see results`)
            
            process.on("beforeExit", ()=>{
                console.log("closing")
                connection.close()
            })
        })
    })
}).catch(error => console.log(error))
