import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';

// Replace with your real hook
const WEBHOOK_URL = 'https://hook.us1.make.com/4sjygnjo5c3jw6ulnqd71nhso2zrbkno';

const magic = new Magic('pk_live_2E6442CA7F379245', {
  network: 'mumbai', // or 'mainnet' if you switch networks
});

async function handleLoginWithEmail(email) {
  try {
    await magic.auth.loginWithEmailOTP({ email });

    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();

    // 👇 Send to Make webhook
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        wallet: walletAddress,
      }),
    });

    alert(`Logged in as ${walletAddress}`);
  } catch (error) {
    console.error('Login failed:', error);
  }
}
