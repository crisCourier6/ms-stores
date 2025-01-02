import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { User } from "./User"
import { StoreHasFood } from "./StoreHasFood"

@Entity()
export class StoreProfile {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({nullable: true})
    address: string

    @Column()
    description: string

    @Column({nullable: true})
    phone: string

    @Column({nullable: true})
    webPage: string

    @Column({nullable: true})
    userId: string

    @OneToOne(()=> User, user=> user.storeProfile, {onDelete: "CASCADE"})
    @JoinColumn({name: "userId"})
    user: User

    @OneToMany(()=> StoreHasFood, storeHasFood=> storeHasFood.storeProfile)
    storeHasFood: StoreHasFood[]
}
