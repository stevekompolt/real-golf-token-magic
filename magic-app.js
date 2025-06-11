import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';

const WEBHOOK_URL = 'https://hook.us1.make.com/4sjygnjo5c3jw6ulnqd71nhso2zrbkno';

const magic = new Magic('pk_live_2E6442CA7F379245', {
  network: 'mumbai',
  testMode: true, // enables Magic SDK debug logging
});

async function handleLoginWithEmail(email) {
  console.log('[Login Flow] Starting login for:', email);

  try {
    // 1. Start login
    await magic.auth.loginWithEmailOTP({ email });
    console.log('[Login Flow] Magic login successful');

    // 2. Create provider and signer
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();

    // 3. Get wallet address
    const walletAddress = await signer.getAddress();
    console.log('[Login Flow] Wallet Address:', walletAddress);

    // 4. Check signer signature
    const message = 'Real Golf Login Verification';
    const signature = await signer.signMessage(message);
    console.log('[Login Flow] Signature:', signature);

    // 5. Send to Make webhook
    const payload = {
      email,
      wallet: walletAddress,
      signature,
      message,
    };

    console.log('[Login Flow] Sending payload to webhook:', payload);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.text();
    console.log('[Login Flow] Webhook response:', result);

    alert(`Logged in as ${walletAddress}`);
  } catch (error) {
    console.error('[Login Flow] Error:', error);
    alert('Login failed. See console for details.');
  }
}
