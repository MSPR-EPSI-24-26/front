'use client';

import Link from 'next/link';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCartStore();

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      toast.success('Produit retiré du panier');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: number, productLabel: string) => {
    removeItem(productId);
    toast.success(`${productLabel} retiré du panier`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Panier vidé');
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <ShoppingCart className="h-8 w-8" />
          <span>Mon Panier</span>
        </h1>
        <p className="text-gray-600 mt-2">
          {totalItems > 0 
            ? `${totalItems} article${totalItems > 1 ? 's' : ''} dans votre panier`
            : 'Votre panier est vide'
          }
        </p>
      </div>

      {items.length === 0 ? (
        // Empty cart state
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-8">
              Découvrez nos produits et ajoutez-les à votre panier pour commencer vos achats.
            </p>
            <Button asChild size="lg">
              <Link href="/products" className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Découvrir nos produits</span>
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        // Cart with items
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Articles ({totalItems})
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Vider le panier
              </Button>
            </div>

            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white border rounded-lg p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Product image placeholder */}
                <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>

                <div className="flex-1 space-y-4">
                  {/* Product info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.product.label}
                    </h3>
                    {item.product.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                        {item.product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">
                        Quantité :
                      </span>
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-3"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <div className="px-4 py-2 font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-3"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Price and remove */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatPrice(item.product.price)} × {item.quantity}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product.id, item.product.label)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stock warning */}
                  {item.quantity > item.product.stock && (
                    <div className="text-red-600 text-sm font-medium">
                      ⚠️ Stock insuffisant (seulement {item.product.stock} disponible{item.product.stock > 1 ? 's' : ''})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Récapitulatif
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''}) :</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Livraison :</span>
                  <span className="text-green-600 font-medium">
                    {totalPrice >= 50 ? 'Gratuite' : formatPrice(5.99)}
                  </span>
                </div>

                {totalPrice < 50 && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    Ajoutez {formatPrice(50 - totalPrice)} pour bénéficier de la livraison gratuite !
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total :</span>
                    <span>{formatPrice(totalPrice + (totalPrice >= 50 ? 0 : 5.99))}</span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full flex items-center justify-center space-x-2 mt-6"
                  asChild
                >
                  <Link href="/checkout">
                    <span>Passer commande</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  asChild
                >
                  <Link href="/products">
                    Continuer mes achats
                  </Link>
                </Button>
              </div>

              {/* Security badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Paiement 100% sécurisé
                  </p>
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <span>🔒 SSL</span>
                    <span>💳 CB</span>
                    <span>🏦 Virement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}