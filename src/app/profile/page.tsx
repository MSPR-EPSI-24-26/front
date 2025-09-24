'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProfile, useUpdateProfile } from '@/hooks/useAuth';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  address: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  postalCode: z.string().regex(/^\d{5}$/, 'Le code postal doit contenir 5 chiffres'),
  country: z.string().min(2, 'Le pays est requis'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { data: profile, isLoading, error, refetch } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone || '',
        address: profile.address,
        city: profile.city,
        postalCode: profile.postalCode,
        country: profile.country,
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone || '',
        address: profile.address,
        city: profile.city,
        postalCode: profile.postalCode,
        country: profile.country,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return <Loading message="Chargement du profil..." />;
  }

  if (error) {
    return (
      <div className="container py-8">
        <ErrorMessage
          message="Impossible de charger le profil"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
              <p className="text-gray-600">
                {user?.role === 'admin' ? 'Administrateur' : 'Client'}
              </p>
            </div>
          </div>
          
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Annuler</span>
              </Button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register('firstName')}
                label="Prénom"
                error={errors.firstName?.message}
                disabled={!isEditing}
              />

              <Input
                {...register('lastName')}
                label="Nom"
                error={errors.lastName?.message}
                disabled={!isEditing}
              />

              <Input
                {...register('email')}
                type="email"
                label="Email"
                error={errors.email?.message}
                disabled={!isEditing}
                className="md:col-span-2"
              />

              <Input
                {...register('phone')}
                type="tel"
                label="Téléphone"
                error={errors.phone?.message}
                disabled={!isEditing}
                className="md:col-span-2"
              />
            </div>
          </div>

          {/* Adresse */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
            <div className="grid grid-cols-1 gap-4">
              <Input
                {...register('address')}
                label="Adresse"
                error={errors.address?.message}
                disabled={!isEditing}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  {...register('city')}
                  label="Ville"
                  error={errors.city?.message}
                  disabled={!isEditing}
                />

                <Input
                  {...register('postalCode')}
                  label="Code postal"
                  error={errors.postalCode?.message}
                  disabled={!isEditing}
                />

                <Input
                  {...register('country')}
                  label="Pays"
                  error={errors.country?.message}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Informations du compte */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du compte</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">ID client :</span>
                <span className="font-medium">#{profile?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type de compte :</span>
                <span className="font-medium capitalize">
                  {user?.role === 'admin' ? 'Administrateur' : 'Client'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Membre depuis :</span>
                <span className="font-medium">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isPending ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}