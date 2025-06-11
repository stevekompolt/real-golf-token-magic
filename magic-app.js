import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';

const magic = new Magic('pk_live_2E6442CA7F379245', {
  network: 'mumbai',
});

const WEBHOOK_URL = 'https://hook.us1.make.com/4sjygnjo5c3jw6ulnqd71nhso2zrbkno';

const walletStatus = document.getElementById('wallet-status');

async function updateUI(wallet) {
  walletStatus.textContent = wallet ? `Wallet: ${wallet}` : 'Wallet: Not connected';
}

// 🔁 Check session on load
window.addEventListener('load', async () => {
  const isLoggedIn = await magic.user.isLoggedIn();
  if (isLoggedIn) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const wallet = await signer.getAddress();
    updateUI(wallet);
  }
});

window.login = async function () {
  const email = document.getElementById('email').value;
  if (!email) return alert('Please enter your email.');

  try {
    await magic.auth.loginWithEmailOTP({ email });

    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const wallet = await signer.getAddress();
    updateUI(wallet);

    const payload = { email, wallet };
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    alert(`Logged in as ${wallet}`);
  } catch (err) {
    console.error('Login error:', err);
    alert('Login failed. Check console.');
  }
};

window.logout = async function () {
  await magic.user.logout();
  updateUI(null);
  alert('Logged out.');
};
