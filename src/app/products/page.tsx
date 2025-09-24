'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading, error, refetch } = useProducts();
  const { addItem } = useCartStore();

  // Filter products based on search and price
  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMinPrice = !minPrice || product.price >= parseFloat(minPrice);
    const matchesMaxPrice = !maxPrice || product.price <= parseFloat(maxPrice);
    
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  }) || [];

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Nos produits</h1>
        <p className="text-gray-600">
          Découvrez notre large sélection de produits de qualité
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </Button>
        </div>

        {showFilters && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Prix minimum (€)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
              />
              
              <Input
                type="number"
                label="Prix maximum (€)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="999"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                  setSearchTerm('');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {products && (
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
            {searchTerm && ` pour "${searchTerm}"`}
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <Loading message="Chargement des produits..." />}

      {/* Error state */}
      {error && (
        <ErrorMessage
          message="Impossible de charger les produits"
          onRetry={() => refetch()}
        />
      )}

      {/* Products grid */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              {/* Product image placeholder */}
              <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.label}
                </h3>
                
                {product.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  
                  <div className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full" size="sm">
                    <Link href={`/products/${product.id}`}>
                      Voir détails
                    </Link>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center space-x-2"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {products && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Essayez de modifier vos critères de recherche ou vos filtres.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setMinPrice('');
              setMaxPrice('');
            }}
          >
            Voir tous les produits
          </Button>
        </div>
      )}
    </div>
  );
}