const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {

  let deployer;
  let dappcord;

  const NAME = "Dappcord";
  const SYMBOL = "DC";

  [deployer] = await ethers.getSigners();

  // Deploy contract
  const Dappcord = await ethers.getContractFactory("Dappcord");
  dappcord = await Dappcord.deploy(NAME, SYMBOL);
  await dappcord.deployed(); //배포가 완료될 때까지 대기

  console.log("contract : ", dappcord.address)

  const CHANNEL_NAMES = ["general","intro","jobs"]
  const COSTS = [tokens(1),tokens(0.5),tokens(0.25)]

  for (let i = 0; i<3; i++){
  // Create a channel
  const transaction = await dappcord.connect(deployer).createChannel(CHANNEL_NAMES[i], COSTS[i]);
  await transaction.wait();

  console.log("생성 완료",CHANNEL_NAMES[i]);
  }


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});