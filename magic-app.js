
const magic = new Magic("pk_live_2E6442CA7F379245", {
  network: {
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    chainId: 80001
  }
});

let provider, signer, contract;
const tokenAddress = "0x2f65028C14c3A792e3A74Fb18A6E09E29c37Ee48";
const abi = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function safeMint(address,uint256) external"
];

async function login() {
  const email = document.getElementById("email").value;
  await magic.auth.loginWithEmailOTP({ email });

  provider = new ethers.providers.Web3Provider(magic.rpcProvider);
  signer = provider.getSigner();
  contract = new ethers.Contract(tokenAddress, abi, signer);

  const address = await signer.getAddress();
  document.getElementById("wallet").innerText = address;

  const balance = await contract.balanceOf(address);
  const decimals = await contract.decimals();
  document.getElementById("balance").innerText = (balance / 10 ** decimals).toLocaleString();
}

async function safeMint() {
  const addr = document.getElementById("mintAddress").value;
  const amt = document.getElementById("mintAmount").value;
  if (!addr || !amt) return alert("Please fill in both fields");

  const decimals = await contract.decimals();
  const amount = ethers.utils.parseUnits(amt, decimals);
  const tx = await contract.safeMint(addr, amount);
  await tx.wait();
  alert("Minted successfully!");
}
