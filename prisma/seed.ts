const prisma = require('../config/client');

import {userTypes} from './seed/userTypes';
import {auths} from './seed/auths';
import {users} from './seed/users';
import {testTypes} from './seed/testTypes';
import {testResults} from './seed/testResults';
import {tests} from './seed/tests';
import {getTestRecords} from './seed/testRecords';

const loadData = async () => {

    console.log('loading data started...');

    // deleting 
    console.log('cleanning up the database...');

    await prisma.TestRecord.deleteMany();
    console.log("Deleted testRecords in test table");

    await prisma.Test.deleteMany();
    console.log("Deleted records in test table");

    await prisma.User.deleteMany();
    console.log("Deleted records in user table");


    await prisma.Auth.deleteMany();
    console.log("Deleted records in Auth table");

    await prisma.UserType.deleteMany();
    console.log("Deleted records in userType table");

    await prisma.TestType.deleteMany();
    console.log("Deleted records in testType table");

    await prisma.TestResult.deleteMany();
    console.log("Deleted records in testResult table");


    await prisma.$queryRaw`ALTER TABLE UserType AUTO_INCREMENT = 1`;
    console.log("reset userType auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE Test AUTO_INCREMENT = 1`;
    console.log("reset test auto increment to 1");
    ////////////////////////////////////////////////////////////////////


    // inserting
    await prisma.UserType.createMany({
        data: userTypes
    });
    console.log("Added userType data");

    await prisma.Auth.createMany({
        data: auths
    });
    console.log("Added Auth data");

    await prisma.User.createMany({ 
        data: users
    });
    console.log("Added user data");

    //////////  testType ///////////////
    await prisma.TestType.createMany({
        data:testTypes
    });
    console.log("Added testTypes data");

    await prisma.TestResult.createMany({
        data:testResults
    });
    console.log("Added testResults data");

    await prisma.Test.createMany({
        data:tests
    });
    console.log("Added test data");

    const testRecords = await getTestRecords();
    await prisma.TestRecord.createMany({
        data:testRecords
    });
    console.log("Added testRecords data");
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