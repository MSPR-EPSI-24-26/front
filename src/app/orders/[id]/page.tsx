'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft,
  Package, 
  Calendar, 
  MapPin, 
  CreditCard,
  User,
  Truck,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useOrder } from '@/hooks/useOrders';
import { useAuthStore } from '@/store';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderStatus } from '@/types';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    description: 'Votre commande est en cours de traitement'
  },
  [OrderStatus.CONFIRMED]: {
    label: 'Confirmée',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle,
    description: 'Votre commande a été confirmée et va être préparée'
  },
  [OrderStatus.PROCESSING]: {
    label: 'En préparation',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Package,
    description: 'Votre commande est en cours de préparation'
  },
  [OrderStatus.SHIPPED]: {
    label: 'Expédiée',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Truck,
    description: 'Votre commande a été expédiée et est en cours de livraison'
  },
  [OrderStatus.DELIVERED]: {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    description: 'Votre commande a été livrée avec succès'
  },
  [OrderStatus.CANCELLED]: {
    label: 'Annulée',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: Package,
    description: 'Cette commande a été annulée'
  }
};

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const orderId = parseInt(params.id);
  const { user, isAuthenticated } = useAuthStore();
  const { data: order, isLoading, error } = useOrder(orderId);

  // Show 404 if order ID is invalid
  if (isNaN(orderId)) {
    notFound();
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
            Vous devez être connecté pour voir cette commande.
          </p>
          <Button asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading message="Chargement de la commande..." />;
  }

  if (error) {
    return (
      <div className="container py-8">
        <ErrorMessage
          message="Impossible de charger cette commande"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!order) {
    notFound();
  }

  // Check if user owns this order
  // if (order.customerId !== user?.id) {
  //   return (
  //     <div className="container py-8">
  //       <div className="text-center py-16">
  //         <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
  //         <h1 className="text-2xl font-semibold text-gray-900 mb-4">
  //           Accès non autorisé
  //         </h1>
  //         <p className="text-gray-600 mb-8">
  //           Cette commande ne vous appartient pas.
  //         </p>
  //         <Button asChild>
  //           <Link href="/orders">Voir mes commandes</Link>
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  const status = statusConfig[order.status] || statusConfig[OrderStatus.PENDING];
  const StatusIcon = status.icon;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="outline" asChild className="flex items-center space-x-2 mb-4">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux commandes</span>
          </Link>
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Commande #{order.id}
            </h1>
            <p className="text-gray-600 mt-1">
              Passée le {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${status.color}`}>
            <StatusIcon className="h-5 w-5" />
            <span className="font-medium">{status.label}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${status.color.replace('text-', 'bg-').replace('bg-', 'bg-').replace('-800', '-200').replace('-100', '-50')}`}>
                <StatusIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {status.label}
                </h3>
                <p className="text-gray-600">
                  {status.description}
                </p>
                {order.status === OrderStatus.SHIPPED && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Suivi de livraison :</strong> Votre colis sera livré dans 2-3 jours ouvrés.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Articles commandés ({order.items?.length || 0})
            </h3>
            
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">
                        {item.product?.label || `Produit #${item.productId}`}
                      </h4>
                      {item.product?.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.product.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Quantité: {item.quantity}</span>
                        <span>Prix unitaire: {formatPrice(item.unitPrice)}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aucun article dans cette commande.</p>
            )}
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Adresse de livraison</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {order.shippingAddress}
              </p>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Récapitulatif
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <div>
                  <div className="font-medium">Date de commande</div>
                  <div>{formatDate(order.createdAt)}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <div>
                  <div className="font-medium">Numéro de commande</div>
                  <div>#{order.id}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <CreditCard className="h-4 w-4" />
                <div>
                  <div className="font-medium">Montant total</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {formatPrice(order.totalAmount)}
                  </div>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="space-y-2 text-sm">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-gray-600">
                          {item.quantity}x {item.product?.label?.slice(0, 20) || `Produit #${item.productId}`}
                          {item.product?.label && item.product.label.length > 20 && '...'}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="pt-4 border-t">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 mb-2">Notes</div>
                    <p className="text-gray-600">{order.notes}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">
                    Continuer mes achats
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}