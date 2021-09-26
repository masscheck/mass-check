import dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.XPX_PRIVATE_KEY as string;
const testNetGenerationHash =
  '56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9';
const testNetUrl = 'http://bctestnet1.brimstone.xpxsirius.io:3000';

export { privateKey, testNetGenerationHash, testNetUrl };
