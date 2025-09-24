'use client';


import Link from 'next/link';
import { ArrowRight, Package, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProducts } from '@/hooks/useProducts';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { formatPrice } from '@/lib/utils';

export default function Home() {
  const { data: products, isLoading, error, refetch } = useProducts();
  const featuredProducts = products?.slice(0, 6) || [];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenue chez PayeTonKawa
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Découvrez notre sélection de produits de qualité à prix imbattables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/products">
                Voir nos produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-blue-600 hover:bg-white">
              <Link href="/register">
                Créer un compte
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="rounded-full bg-blue-100 p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Large sélection</h3>
            <p className="text-gray-600">
              Des milliers de produits disponibles pour tous vos besoins
            </p>
          </div>
          
          <div className="text-center">
            <div className="rounded-full bg-green-100 p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Paiement sécurisé</h3>
            <p className="text-gray-600">
              Vos transactions sont protégées par les dernières technologies
            </p>
          </div>
          
          <div className="text-center">
            <div className="rounded-full bg-purple-100 p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Livraison rapide</h3>
            <p className="text-gray-600">
              Recevez vos commandes rapidement grâce à notre réseau logistique
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Produits en vedette</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits populaires et nouveautés
          </p>
        </div>

        {isLoading && <Loading message="Chargement des produits..." />}
        
        {error && (
          <ErrorMessage
            message="Impossible de charger les produits"
            onRetry={() => refetch()}
          />
        )}

        {featuredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{product.label}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/products/${product.id}`}>
                        Voir détails
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/products">
                  Voir tous les produits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50">
        <div className="container py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer vos achats ?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Créez votre compte dès maintenant et profitez d'une expérience d'achat exceptionnelle
          </p>
          <Button asChild size="lg">
            <Link href="/register">
              Créer mon compte gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}