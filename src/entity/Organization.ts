import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import { CipherNameAndProtocol } from "tls";
import { User } from "./User";
import { Person } from "./Person";
import { Project } from "./Project";
import { Technology } from "./Technology";
import _ from 'lodash';
@Entity({name: 'organization'})
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('varchar')
    name!: string;

    @Column('text')
    brief?: string;

    @Column({
        type: "enum",
        enum: ["active", "deactive", "deleted"],
        default: 'active'
    })
    status!: string;

    @Column('varchar')
    website!: string;

    @Column('simple-array')
    mailext!: string[];

    @ManyToOne(() => Person, p => p.belong_organization)
    people?: Person[];

    @ManyToOne(() => Project, p => p.organization)
    project?: Project[];

    @ManyToOne(() => Technology, t => t.organization)
    technology?: Technology[];

    @Column('tinyint')
    member!: boolean;

    toJSON() {
        return _.omit(this, ['people', 'project', 'technology']);
    }

    toSimpleJSON(){
        return _.pick(this, ['id', 'name', 'website'])
    }

}
