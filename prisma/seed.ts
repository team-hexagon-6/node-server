const prisma = require('../database/client');

import {userTypes} from './seed/userTypes'
import {auths} from './seed/auths'
import {users} from './seed/users'

const loadData = async () => {

    console.log('loading data started...');

    // deleting 
    console.log('cleanning up the database...');

    await prisma.user.deleteMany();
    console.log("Deleted records in user table");


    await prisma.Auth.deleteMany();
    console.log("Deleted records in Auth table");


    await prisma.userType.deleteMany();
    console.log("Deleted records in userType table");

    await prisma.$queryRaw`ALTER TABLE userType AUTO_INCREMENT = 1`;
    console.log("reset userType auto increment to 1");
    ////////////////////////////////////////////////////////////////////


    // inserting
    await prisma.userType.createMany({
        data: userTypes
    });
    console.log("Added userType data");

    await prisma.Auth.createMany({
        data: auths
    });
    console.log("Added Auth data");

    await prisma.user.createMany({ 
        data: users
    });
    console.log("Added user data");
    /////////////////////////////////////////////////////////////////////


}

loadData()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // await prisma.$disconnect();
        console.log('Data loaded...');
    });