import { NETWORKS } from "./networks";

export const CONTRACT_ADDRESSES = {
  [NETWORKS.IoTex]: {
    ioTexStakerMerkleTree: "0xAaa0C6D40BEE7F5395e5cfb7CA28074851B92268",
    lpsMerkleTree: "0xA27984317a8aD4A66028F92907e80Da863AF7385",
    airdropLoxNFT: "0x61dA716A7F7221F994A08dD313256A8c8e02664E",
    MerkleTreeLoxNFT: "0xC22c493F5E9607ff160146C37E1A995DFD379a6f",
    MerkleRoot:
      "0xca300803f7845a64c3c3676cd28c41f617d9c9698ea4ea001d26d693ccf20884",

    TraderRewards: "0x18a5d62505B77Ff5116718E3192A42A6b3f2922E",

    EpochController: "",
    AirdropClaim: "0x8e159E8b84F9aD2d8cd41B46f0B7a4539F0022CE",
    MerkleTree: "0x773573Dc278b88A5205564698246142c82fA2d80",
    Multicall: "0x13AE1e5702DffcfD9900713f2Ba9d2995af7ed5D",
    USDT: "0x6fbcdc1169b5130c59e72e51ed68a84841c98cd1",
    IOTX: "0x4200000000000000000000000000000000000006",
    WRAPPED_IOTX: "0xA00744882684C3e4747faEFD68D283eA44099D03",
    LOX: "0x2ff90cA1A004f8900Ab498259Fc4E148e39331fD",
    veArtProxy: "0x5623494Ad2Bdf9104C8Bd6D3363fD72dc5aF8489",
    VotingEscrow: "0x5EF2b39FD170584839f55d9BF9be0C5DD7a51C6f",
    RewardDistributor: "0x255d1342a448c947304486d0adb4054cf18dF32e",
    PAIR_FACTORY: "0x9442E8d017bb3dC2Ba35d75204211e60f86fF0F8",
    GaugeFactoryV2_1: "0x3dDeDDF3694105E5d8B7fA4dF31D825c68ddA554",
    BribeFactory: "0x1951B18768bF2E7cA76e2da51575017C225043CB",
    Voter: "0x949e5a9FcC69F93e4EF35FeAD6B0d8693f28D603",
    WrappedExternalBribeFactory: "0x56e97366930e562646Caf1Af6963Aa6f0613d64a",
    ROUTER: "0xdF26eff103B7370B3BbA92686e4bd8c9EA4fC5ac",
    LoxoHolders: "0x7f8Cb1d827F26434da652B4E9Bd02C698cC2842a",
    MaterChef: "0x71A2Ae8E6E3E70643F60cD49a951206905232Ed5",
    Royalties: "0xD49A940ec11A9e474D829114aB1D51Db9d5b5472",
    Minter: "0xCB92D1173FbB4391138408E81f7ccBAaaD71Bc19",
    pairAPI: "0xd9814e2485D60a404F458ebe3df3866FCBfB8ED7",
    veNFTAPIV2: "0xa5462DC0aaCc9358f529A81D174350AFa47ca1aA",
    rewardApi: "0x54854C2FFd1454e54ee29a569bBAFa1Bc821100a",
    LOXlibrary: "0xf36239D2b7C7660D71163cC1707c1164757b0404",
    StakingNFTFeeConverter: "0x4DF06ce13dfa71c78cc54b203609b0aa5b10a523",
    NFTSalesSplitter: "0xC2B579b84bB4CF4908Ef08acF43022eF94304B14",
  },
  [NETWORKS.IoTexTestnet]: {
    ioTexStakerMerkleTree: "0x090b11fd0B0e5c0E494720A24ebE962b2c85B801",
    lpsMerkleTree: "0x431ECba6B70C461350F70f1cB88E377Aac00C1b9",
    airdropLoxNFT: "0x61dA716A7F7221F994A08dD313256A8c8e02664E",
    MerkleTreeLoxNFT: "0xC22c493F5E9607ff160146C37E1A995DFD379a6f",
    MerkleRoot:
      "0xca300803f7845a64c3c3676cd28c41f617d9c9698ea4ea001d26d693ccf20884",

    TraderRewards: "0x18a5d62505B77Ff5116718E3192A42A6b3f2922E",

    EpochController: "",
    AirdropClaim: "0x4be1c83a4031C0418b36170bCeA21Cc6591b2840",
    MerkleTree: "0xedA7c54147e92613A4d3E1b95993Bb5Ad4e6E982",

    USDT: "0xD73C4883286AbD896Db4a2B61A86bB8C71eCFE41",
    Multicall: "0x698e01149519628A015D76559c6E2672275C1330",
    IOTX: "0x4200000000000000000000000000000000000006",
    WRAPPED_IOTX: "0x36f4fd3b69Cd4ab80E3eb2c63DBaca87c80D6eF3",
    LOX: "0xA9ADaCbCea0C101561f317D4226dc628253fEBFe",
    veArtProxy: "0xcd4e05Fc1f6b0C5a960D8f0171C59e9bc393BD79",
    VotingEscrow: "0x11639a0c3155f7601c66c7c03da0504957177877",
    RewardDistributor: "0xa0568ac675d71845ef8d0b70543D56664Df0ef20",
    PAIR_FACTORY: "0xDb814E63A25D50dfAb5393e9415F868118dD3Bc3",
    GaugeFactoryV2_1: "0x525C9a9eb50Acd5A8520c467C191153Ccb770B88",
    BribeFactory: "0xf3f6eBF31bcadEE8aFF414Faa00480943B405acA",
    Voter: "0x168b290504bECc23f5f713F562359a3330471967",
    WrappedExternalBribeFactory: "0x40197AE4E7E98Cd871cF0EAb982bb2084d0847e7",
    ROUTER: "0x840daF481680e24577a513F6f73Ed1abF0A0e227",
    LoxoHolders: "0x541fB31b9eeD139276E6B5053bed0EBd75F472f7",
    MaterChef: "0xEC69989D5e0999d28A4434212f35eC877Ad94442",
    Royalties: "0x54882cc049C438DEb40e7D98d5456d1Aff104f66",
    Minter: "0x7d4368B1E757157eBF332bb00CB645Fbb0DBB505",
    pairAPI: "0xe74e43a0BE3b79275512c08A376711483d4C8948",
    veNFTAPIV2: "0xC7Dc38Cf0d02F83E64E4D67b2daAE6c242033A61",
    rewardApi: "0x529939ab3a28D626135425523459048d65daF06a",
    LOXlibrary: "0x24F79d13DaB56469D386794aa330867A7a61E7d4",
    StakingNFTFeeConverter: "0xBB29196d70e2266210656E17e80f18E235f718eb",
    NFTSalesSplitter: "0x96fc440616BF660c388AFD9b09C55AD31467F26b",
  },
  // [NETWORKS.IoTexTestnet]: {
  //   airdropLoxNFT: "0x61dA716A7F7221F994A08dD313256A8c8e02664E",
  //   MerkleTreeLoxNFT: "0xC22c493F5E9607ff160146C37E1A995DFD379a6f",
  //   MerkleRoot:
  //     "0xca300803f7845a64c3c3676cd28c41f617d9c9698ea4ea001d26d693ccf20884",

  //   Royalties: "0xBdee33Df628D637DB72209E6F76fDe150c5702C9",
  //   TraderRewards: "0x18a5d62505B77Ff5116718E3192A42A6b3f2922E",

  //   StakingNFTFeeConverter: "0x361cD217f5606467794bF2793d59d98967Bb472F",
  //   NFTSalesSplitter: "0xfA9D991a9Fe140dA661788C33C20C2ddFE71aBDA",
  //   EpochController: "",
  //   AirdropClaim: "0x4be1c83a4031C0418b36170bCeA21Cc6591b2840",
  //   MerkleTree: "0xedA7c54147e92613A4d3E1b95993Bb5Ad4e6E982",

  //   USDT:"0x27c7889a5becbc15198cc41eb3cd7d9b6776e2f7",
  //   Multicall: "0xEb2199570e67E1A7bdcDA0fdDbE90f8F10BEEC1c",
  //   IOTX: "0x4200000000000000000000000000000000000006",
  //   WRAPPED_IOTX: "0xBd1D31A314Dd0e89FB583D1fBb903583607A3775",
  //   LOX: "0xbBF57B197B91209D4513Aa88fD28ee7385D90747",
  //   veArtProxy: "0x56946FcEE1e875ED0d76cB3D3a3b0d319b563468",
  //   VotingEscrow: "0xf11bb1222cA6FB3C021cd198EdB1a1ade9BD94eD",
  //   RewardDistributor: "0xdadA41d53A2E1a0b844C4D9097A0e59A1e868415",
  //   PAIR_FACTORY: "0xC4cE578f9Dd070d273D4C289E2527f6CE8eAEACB",
  //   GaugeFactoryV2_1: "0x1D9e0C5D8112A2a1B13085A2EB4Ff2C155120699",
  //   BribeFactory: "0x6fE7aD7a9126605B36bA65A922fbd0b70A7E8Bb6",
  //   Voter: "0x85744a837A84F3f5d4aD0014Cbf82204bAfD878d",
  //   WrappedExternalBribeFactory: "0x02d94eA4092979c012B072fC7e37cC4b585A4646",
  //   ROUTER: "0x75e91452A45BE29f5a78b8bBCc41747aE57AFF06",
  //   LoxoHolders: "0x8e159E8b84F9aD2d8cd41B46f0B7a4539F0022CE",
  //   MaterChef: "0xAD22e6b6Ec51753d2e29530889A6Fa9386E48243",
  //   Minter: "0x773573Dc278b88A5205564698246142c82fA2d80",
  //   pairAPI: "0x205fEED021FE772dd46fBAEfA71fa46b18b38438",
  //   veNFTAPIV2: "0xe6c441C62E3738e16F8843E31903C163592950DC",
  //   rewardApi: "0xFaE6aeEE209a3E8E12d1502d4Acf02998B4aE218",
  //   LOXlibrary: "0xb708Ea054c189210E720Ef2787A561114eFf45f6",
  // },
};
