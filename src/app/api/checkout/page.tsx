// Example merchant integration
import { Checkout } from '@/components/Checkout';

function StorePage() {
  return (
    <div>
      {/* Product listings */}
      <Checkout merchantId="MERCHANT_ID" onPaymentVerified={(tx) => {
        // Handle successful payment
      }} />
    </div>
  );
}