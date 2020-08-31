import {getConnectionManager, Connection} from 'typeorm';
import 'reflect-metadata';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { User } from '../src/entity/User';
import { Organization } from '../src/entity/Organization';
import { Contact } from '../src/entity/Contact';
import { Person } from '../src/entity/Person';
import { Project } from '../src/entity/Project';
import { Technology } from '../src/entity/Technology';

const CONN_NAME = "default"

const options: MysqlConnectionOptions = {
    "name": CONN_NAME,
    "type":"mariadb",
    "host": "localhost",
    "port": 3306,
    "username": "admin",
    "password": "password",
    "database": "dyform",
    "synchronize": true,
    "logging": false,
    "entities": [User, Contact, Person, Organization, Project,Technology]
}

export async function ensureConnection(name: string = 'default'): Promise<Connection> {
    const connectionManager = getConnectionManager();
  
    if (connectionManager.has(name)) {
      const connection = connectionManager.get(name);
  
      if (!connection.isConnected) {
        await connection.connect();
      }
  
    //   if (process.env.NODE_ENV !== 'production') {
    //     await updateConnectionEntities(connection, options[name].entities);
    //   }
  
      return connection;
    }
  
    return await connectionManager.create(options).connect();
  }
// const promise = (async function () {
//     const manager = getConnectionManager();
//     const current = manager.has('default') ? manager.get('default'):await create();
//     // if (current) {await current.close();}
//     return current;
// })();

export const getDatabaseConnection = async () => {
    const manager = getConnectionManager();
    if (manager.has(CONN_NAME)){
        return manager.get(CONN_NAME);
    }else{
        console.log("doing connection");
        await manager.create(options).connect();
        console.log(manager.get(CONN_NAME).isConnected);
        return manager.get(CONN_NAME);
    }
    // console.log(current);
    // console.log(current.isConnected)
    // await current.connect().catch(e=> console.log(e))
    // console.log("======success====");
    // console.log(current.isConnected)
    // if(current.isConnected){
    //     console.log("current connected")
    // }else{
    //     await current.connect()
    //     console.log("current  reconnect")
    // }
  
};

// export const dbManager = async () =>  await getDatabaseConnection().then(conn=>conn.)