import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm"
import { StoreHasFood } from "./StoreHasFood"

@Entity()
export class FoodLocal {

    @PrimaryColumn({unique: true})
    id: string

    @Column()
    name: string

    @Column({default: "defaultFood.png"})
    picture: string

    @Column({type: "jsonb", nullable: true})
    foodData: any

    @OneToMany(()=>StoreHasFood, storeHasFood=>storeHasFood.foodLocal)
    storeHasFood: StoreHasFood[]
}
