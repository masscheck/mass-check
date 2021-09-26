import {
  AccountHttp,
  MosaicHttp,
  Address,
  MosaicService,
} from 'tsjs-xpx-chain-sdk';

const url = 'http://bctestnet1.brimstone.xpxsirius.io:3000';
const accountHttp = new AccountHttp(url);
const mosaicHttp = new MosaicHttp(url);
const mosaicService = new MosaicService(accountHttp, mosaicHttp);

const address = Address.createFromRawAddress(
  'VCLZMKV4YAVDNVXDUYU22MCDCQRJXFUGYRGRIXW7'
);

mosaicService.mosaicsAmountViewFromAddress(address).subscribe((res) => {
  res.forEach((element) => {
    console.log(element.relativeAmount());
  });
});

// hash
// B05C5ABD641966D6AE1653506403F8A5A3E865B3EE838D9576F48BAA5EE4F988
