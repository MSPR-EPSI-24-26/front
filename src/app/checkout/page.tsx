'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  MapPin, 
  User,
  Check,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated, isHydrated } = useAuthHydrated();
  const { mutate: createOrder, isPending } = useCreateOrder();
  
  // Debug user state
  console.log('Checkout - user:', user);
  console.log('Checkout - isAuthenticated:', isAuthenticated);
  console.log('Checkout - isHydrated:', isHydrated);
  
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice >= 50 ? 0 : 5.99;
  const finalTotal = totalPrice + shippingCost;

  // Show loading while hydrating
  if (!isHydrated) {
    return <Loading message="Chargement..." />;
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Votre panier est vide
          </h1>
          <p className="text-gray-600 mb-8">
            Ajoutez des produits à votre panier avant de passer commande.
          </p>
          <Button asChild>
            <Link href="/products">
              Découvrir nos produits
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <div className="text-center py-16">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Connexion requise
          </h1>
          <p className="text-gray-600 mb-8">
            Vous devez être connecté pour passer une commande.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Créer un compte</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate forms
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
      toast.error('Veuillez remplir toutes les informations de livraison');
      return;
    }

    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.cardholderName) {
      toast.error('Veuillez remplir toutes les informations de paiement');
      return;
    }

    // Create order
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour passer commande.');
      router.push('/login');
      return;
    }

    const orderData = {
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price,
      })),
      shippingAddress: `${shippingInfo.address}, ${shippingInfo.city} ${shippingInfo.postalCode}, ${shippingInfo.country}`,
      billingAddress: `${shippingInfo.address}, ${shippingInfo.city} ${shippingInfo.postalCode}, ${shippingInfo.country}`,
      notes: `Paiement par carte se terminant par ${paymentInfo.cardNumber.slice(-4)}`,
    };

    createOrder(orderData, {
      onSuccess: (order) => {
        clearCart();
        toast.success('Commande passée avec succès !');
        router.push(`/orders/${order.id}`);
      },
      onError: (error) => {
        console.error('Error creating order:', error);
        toast.error('Erreur lors de la création de la commande');
      },
    });
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="outline" asChild className="flex items-center space-x-2 mb-4">
          <Link href="/cart">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour au panier</span>
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">Finaliser ma commande</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Adresse de livraison
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Adresse complète"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Rue de la République"
                    required
                  />
                </div>
                
                <Input
                  label="Ville"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Paris"
                  required
                />
                
                <Input
                  label="Code postal"
                  value={shippingInfo.postalCode}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                  placeholder="75000"
                  required
                />
                
                <div className="md:col-span-2">
                  <Input
                    label="Pays"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, country: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Informations de paiement
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Numéro de carte"
                    type="text"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                
                <Input
                  label="Date d'expiration"
                  type="text"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                />
                
                <Input
                  label="CVV"
                  type="text"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  maxLength={4}
                  required
                />
                
                <div className="md:col-span-2">
                  <Input
                    label="Nom du titulaire"
                    value={paymentInfo.cardholderName}
                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardholderName: e.target.value }))}
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-green-600 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Paiement sécurisé</p>
                    <p>Vos informations de paiement sont protégées par un cryptage SSL 256 bits.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Récapitulatif de commande
              </h3>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.label}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantité: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total :</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Livraison :</span>
                  <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingCost === 0 ? 'Gratuite' : formatPrice(shippingCost)}
                  </span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total :</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <Button 
                type="submit"
                size="lg" 
                className="w-full mt-6"
                disabled={isPending}
              >
                {isPending ? (
                  <Loading />
                ) : (
                  <>Confirmer la commande</>
                )}
              </Button>

              {/* Security info */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>Livraison en 2-3 jours ouvrés</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}