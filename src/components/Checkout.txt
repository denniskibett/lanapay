'use client';
import { useState, useEffect } from 'react';
import { createQR } from '@solana/pay';
import { Keypair, PublicKey } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

interface MerchantConfig {
  walletAddress: string;
  inventory: Product[];
  currencyOptions: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
}

interface CheckoutProps {
  merchantId: string;
  onPaymentVerified: (txSignature: string) => void;
}

export default function Checkout({ merchantId, onPaymentVerified }: CheckoutProps) {
  const [user, setUser] = useState<{ wallet?: string; email?: string; phone?: string }>({});
  const [cart, setCart] = useState<Product[]>([]);
  const [merchantConfig, setMerchantConfig] = useState<MerchantConfig | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [selectedCurrency, setSelectedCurrency] = useState('SOL');

  // Fetch merchant configuration
  useEffect(() => {
    const fetchMerchantConfig = async () => {
      const res = await fetch(`/api/merchants/${merchantId}`);
      const config = await res.json();
      setMerchantConfig(config);
      setSelectedCurrency(config.currencyOptions[0]);
    };
    fetchMerchantConfig();
  }, [merchantId]);

  // Wallet connection
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.solana) {
      const wallet = new PhantomWalletAdapter();
      await wallet.connect();
      setUser({ wallet: wallet.publicKey?.toString() });
    }
  };

  // Email/phone login
  const handleAuth = async (type: 'email' | 'phone', value: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ type, value })
    });
    const { user } = await res.json();
    setUser(user);
  };

  // Payment processing
  const handleCheckout = async () => {
    try {
      const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
      const reference = new Keypair().publicKey.toString();
      
      const paymentRequest = {
        recipient: merchantConfig?.walletAddress,
        amount: totalAmount,
        currency: selectedCurrency,
        reference,
        items: cart.map(item => item.id)
      };

      // Generate QR code
      const { url } = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify(paymentRequest)
      }).then(res => res.json());

      const qr = createQR(url);
      const qrBlob = await qr.getRawData('png');
      setQrCode(URL.createObjectURL(qrBlob));

      // Start payment verification
      const verification = setInterval(async () => {
        const res = await fetch(`/api/transactions/${reference}`);
        const tx = await res.json();
        
        if (tx.confirmed) {
          clearInterval(verification);
          setTxStatus('verified');
          onPaymentVerified(tx.signature);
          await fetch('/api/inventory/update', {
            method: 'POST',
            body: JSON.stringify({ items: cart, merchantId })
          });
        }
      }, 5000);
    } catch (error) {
      setTxStatus('failed');
    }
  };

  if (!merchantConfig) return <div>Loading merchant configuration...</div>;

  return (
    <div className="checkout-container">
      {/* Auth Section */}
      {!user.wallet && !user.email && !user.phone && (
        <div className="auth-section">
          <button onClick={connectWallet} className="wallet-button">
            <img src="/phantom-icon.svg" alt="Phantom Wallet" />
            Connect Wallet
          </button>
          <div className="social-auth">
            <input 
              type="email" 
              placeholder="Enter email" 
              onBlur={(e) => handleAuth('email', e.target.value)}
            />
            <input
              type="tel"
              placeholder="Enter phone"
              onBlur={(e) => handleAuth('phone', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Cart Preview */}
      <div className="cart-section">
        <h3>Your Cart</h3>
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <span>{item.name}</span>
            <span>{item.price} {item.currency}</span>
          </div>
        ))}
      </div>

      {/* Checkout Controls */}
      <div className="payment-controls">
        <CurrencySelector 
          currencies={merchantConfig.currencyOptions}
          selected={selectedCurrency}
          onChange={setSelectedCurrency}
        />
        
        {qrCode ? (
          <div className="qr-section">
            <img src={qrCode} alt="Payment QR Code" />
            <p>Scan to pay with Solana Pay</p>
            <div className={`tx-status ${txStatus}`}>
              {txStatus === 'verified' && 'Payment Confirmed!'}
              {txStatus === 'failed' && 'Payment Failed - Please Retry'}
            </div>
          </div>
        ) : (
          <button 
            onClick={handleCheckout}
            disabled={!user || cart.length === 0}
            className="checkout-button"
          >
            Proceed to Payment
          </button>
        )}
      </div>
    </div>
  );
}

// Merchant Dashboard Page
// app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Checkout from '@/components/Checkout';

interface MerchantDashboard {
  balance: number;
  transactions: Transaction[];
  inventory: Product[];
}

export default function MerchantDashboard() {
  const [dashboardData, setDashboardData] = useState<MerchantDashboard | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({ id: '', name: '', price: 0, currency: 'SOL' });

  useEffect(() => {
    const loadDashboard = async () => {
      const res = await fetch('/api/merchants/dashboard');
      const data = await res.json();
      setDashboardData(data);
    };
    loadDashboard();
  }, []);

  const handlePaymentVerification = (txSignature: string) => {
    setDashboardData(prev => ({
      ...prev!,
      transactions: [...prev!.transactions, { signature: txSignature, status: 'confirmed' }]
    }));
  };

  const addProduct = async () => {
    await fetch('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(newProduct)
    });
    setDashboardData(prev => ({
      ...prev!,
      inventory: [...prev!.inventory, newProduct]
    }));
  };

  return (
    <div className="dashboard-container">
      <div className="merchant-balance">
        <h2>Current Balance: {dashboardData?.balance} SOL</h2>
      </div>

      <div className="inventory-management">
        <h3>Product Inventory</h3>
        <div className="add-product">
          <input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          />
          <button onClick={addProduct}>Add Product</button>
        </div>
      </div>

      <div className="transaction-history">
        <h3>Recent Transactions</h3>
        <ul>
          {dashboardData?.transactions.map(tx => (
            <li key={tx.signature}>
              <a href={`https://explorer.solana.com/tx/${tx.signature}`} target="_blank">
                {tx.signature.slice(0, 12)}...{tx.signature.slice(-12)}
              </a>
              <span className={`status ${tx.status}`}>{tx.status}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Embedded Checkout Preview */}
      <div className="checkout-preview">
        <h3>Checkout Preview</h3>
        <Checkout 
          merchantId="current_merchant" 
          onPaymentVerified={handlePaymentVerification}
        />
      </div>
    </div>
  );
}