'use client';

import Link from 'next/link';
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/store';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderStatus } from '@/types';

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳'
  },
  [OrderStatus.CONFIRMED]: {
    label: 'Confirmée',
    color: 'bg-blue-100 text-blue-800',
    icon: '✅'
  },
  [OrderStatus.PROCESSING]: {
    label: 'En préparation',
    color: 'bg-purple-100 text-purple-800',
    icon: '📦'
  },
  [OrderStatus.SHIPPED]: {
    label: 'Expédiée',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '🚚'
  },
  [OrderStatus.DELIVERED]: {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800',
    icon: '📦'
  },
  [OrderStatus.CANCELLED]: {
    label: 'Annulée',
    color: 'bg-red-100 text-red-800',
    icon: '❌'
  }
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const { data: orders, isLoading, error, refetch } = useOrders();
  console.log(isAuthenticated, orders);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Connexion requise
          </h1>
          <p className="text-gray-600 mb-8">
            Vous devez être connecté pour voir vos commandes.
          </p>
          <Button asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <Package className="h-8 w-8" />
          <span>Mes commandes</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Suivez l'état de vos commandes et consultez l'historique
        </p>
      </div>

      {/* Loading state */}
      {isLoading && <Loading message="Chargement de vos commandes..." />}

      {/* Error state */}
      {error && (
        <ErrorMessage
          message="Impossible de charger vos commandes"
          onRetry={() => refetch()}
        />
      )}

      {/* Orders list */}
      {orders && (
        <>
          {orders.length === 0 ? (
            // Empty state
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Aucune commande
              </h2>
              <p className="text-gray-600 mb-8">
                Vous n'avez pas encore passé de commande. Découvrez nos produits !
              </p>
              <Button asChild size="lg">
                <Link href="/products">
                  Découvrir nos produits
                </Link>
              </Button>
            </div>
          ) : (
            // Orders grid
            <div className="space-y-6">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig[OrderStatus.PENDING];
                
                return (
                  <div
                    key={order.id}
                    className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Order info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Commande #{order.id}
                          </h3>
                          
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                            {status.icon} {status.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Passée le {formatDate(order.createdAt)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4" />
                            <span className="font-semibold text-blue-600">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </div>
                          
                          {order.shippingAddress && (
                            <div className="flex items-start space-x-2 md:col-span-2">
                              <MapPin className="h-4 w-4 mt-0.5" />
                              <span className="line-clamp-2">
                                {order.shippingAddress}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Order items summary */}
                        {order.items && order.items.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                {order.items.length} article{order.items.length > 1 ? 's' : ''}
                              </span>
                              {order.items.slice(0, 2).map((item, index) => (
                                <span key={index}>
                                  {index === 0 ? ' : ' : ', '}
                                  {item.quantity}x {item.product?.label || `Produit #${item.productId}`}
                                </span>
                              ))}
                              {order.items.length > 2 && (
                                <span> et {order.items.length - 2} autre{order.items.length > 3 ? 's' : ''}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex items-center space-x-2"
                        >
                          <Link href={`/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                            <span>Voir détails</span>
                          </Link>
                        </Button>

                        {order.status === OrderStatus.PENDING && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span>Actualiser</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Load more button (if needed) */}
              {orders.length >= 10 && (
                <div className="text-center pt-8">
                  <Button variant="outline" onClick={() => refetch()}>
                    Charger plus de commandes
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}