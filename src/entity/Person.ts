import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import { User } from "./User";
import {Contact} from "./Contact";
import { Organization } from "./Organization";
import _ from 'lodash';

@Entity({name: 'person'})
export class Person {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne( () => User)
    @JoinColumn()
    user!: User;


    @ManyToOne(() => Organization, org => org.people)
    belong_organization!: Organization;

    @Column("simple-array")
    expertise?: string[];

    @Column("boolean")
    COVID_19!: boolean;

    @OneToMany(() => Contact, contact => contact.person)
    contact?: Contact[];

    toJSON() {
        return _.omit(this, ['contact', 'user']);
    }
}
