import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm"
import { StoreProfile } from "./StoreProfile"
import { FoodLocal } from "./FoodLocal"

@Entity()
export class StoreHasFood {
    @PrimaryColumn()
    storeId: string

    @PrimaryColumn()
    foodLocalId: string

    @Column()
    isAvailable: boolean

    @ManyToOne(()=>StoreProfile, storeProfile => storeProfile.storeHasFood, {onDelete: "CASCADE"})
    @JoinColumn({name: "storeId"})
    storeProfile: StoreProfile

    @ManyToOne(()=>FoodLocal, foodLocal => foodLocal.storeHasFood, {onDelete: "CASCADE"})
    @JoinColumn({name: "foodLocalId"})
    foodLocal: FoodLocal
}