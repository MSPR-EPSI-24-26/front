'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Package, 
  ShoppingCart, 
  Minus, 
  Plus, 
  ArrowLeft, 
  Star,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const productId = parseInt(params.id);
  
  const { data: product, isLoading, error } = useProduct(productId);
  const { addItem } = useCartStore();

  // Show 404 if product ID is invalid
  if (isNaN(productId)) {
    notFound();
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && (!product || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem(product, quantity);
    toast.success(`${quantity} ${product.label} ajouté${quantity > 1 ? 's' : ''} au panier`);
  };

  if (isLoading) {
    return <Loading message="Chargement du produit..." />;
  }

  if (error) {
    return (
      <div className="container py-8">
        <ErrorMessage
          message="Impossible de charger le produit"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="container py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="outline" asChild className="flex items-center space-x-2">
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux produits</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product image */}
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <Package className="h-24 w-24 text-gray-400" />
        </div>

        {/* Product information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.label}
            </h1>
            
            {product.description && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Price and stock */}
          <div className="space-y-4">
            <div className="text-4xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </div>

            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 text-sm font-medium ${
                isOutOfStock ? 'text-red-600' : 
                isLowStock ? 'text-orange-600' : 
                'text-green-600'
              }`}>
                {isOutOfStock ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span>Rupture de stock</span>
                  </>
                ) : isLowStock ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span>Stock limité ({product.stock} restant{product.stock > 1 ? 's' : ''})</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quantity selector */}
          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium text-gray-900">Quantité :</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <div className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-3"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Total: {formatPrice(product.price * quantity)}
              </div>
            </div>
          )}

          {/* Add to cart button */}
          <div className="space-y-4">
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              size="lg"
              className="w-full flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>
                {isOutOfStock ? 'Produit indisponible' : 'Ajouter au panier'}
              </span>
            </Button>

            {isOutOfStock && (
              <p className="text-sm text-gray-500 text-center">
                Ce produit sera bientôt de nouveau disponible
              </p>
            )}
          </div>

          {/* Product details */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Détails du produit
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ID Produit :</span>
                <span className="font-medium">#{product.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Prix unitaire :</span>
                <span className="font-medium">{formatPrice(product.price)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Disponibilité :</span>
                <span className={`font-medium ${
                  isOutOfStock ? 'text-red-600' : 'text-green-600'
                }`}>
                  {isOutOfStock ? 'Indisponible' : `${product.stock} en stock`}
                </span>
              </div>
            </div>
          </div>

          {/* Additional information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  Livraison gratuite
                </h4>
                <p className="text-sm text-blue-700">
                  Livraison gratuite pour toute commande supérieure à 50€
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related products section placeholder */}
      <div className="mt-16 border-t pt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Produits similaires
        </h2>
        <div className="text-center py-12 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Les produits similaires seront bientôt disponibles</p>
        </div>
      </div>
    </div>
  );
}