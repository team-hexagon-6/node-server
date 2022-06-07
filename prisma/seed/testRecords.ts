const prisma = require('../../config/client');

const testRecords =[
    {
        test_id:'',
        test_result_id:1,
        examiner_id:"190000002E",
        test_type_id:1,
    },
    {
        test_id:'',
        test_result_id:1,
        examiner_id:"190000002E",
        test_type_id:0,
    },
    {
        test_id:'',
        test_result_id:0,
        examiner_id:"190000005E",
        test_type_id:1,
    },
    {
        test_id:'',
        test_result_id:0,
        examiner_id:"190000005E",
        test_type_id:1,
    },
    {
        test_id:'',
        test_result_id:0,
        examiner_id:"190000008E",
        test_type_id:1,
    },
]

export async function getTestRecords() { 
    const testIDs = await prisma.test.findMany({
        select : {
            id:true
        }
    });

    // console.log(testIDs[0].id);
    testRecords[0].test_id = testIDs[0].id;
    testRecords[1].test_id = testIDs[0].id;
    testRecords[2].test_id = testIDs[0].id;
    testRecords[3].test_id = testIDs[1].id;
    testRecords[4].test_id = testIDs[2].id;


    return testRecords ;
}


