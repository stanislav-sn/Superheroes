import { useState, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { SuperheroList } from '../features/superhero-list/components/SuperheroList';
import { Pagination } from '../features/superhero-list/components/Pagination';
import { SuperheroForm } from '../features/superhero-form/components/SuperheroForm';
import { useSuperheroList } from '../shared/hooks/useSuperheroList';
import { useSuperheroMutations } from '../shared/hooks/useSuperheroMutations';
import type {
  SuperheroEntity,
  CreateSuperheroRequest,
  UpdateSuperheroRequest,
} from '../../../../packages/types/types';
import Loader from '@/components/Loader';

const CatalogPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSuperhero, setEditingSuperhero] = useState<SuperheroEntity | null>(null);
  const [deletingSuperheroId, setDeletingSuperheroId] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit =
    searchParams.get('limit') === 'all'
      ? 'all'
      : (parseInt(searchParams.get('limit') || '5', 10) as 5 | 16);

  const { data, isLoading, error } = useSuperheroList({ page, limit });
  const { createSuperhero, updateSuperhero, deleteSuperhero, isCreating, isUpdating, isDeleting } =
    useSuperheroMutations();

  const updateFilters = (newPage: number, newLimit: number | 'all') => {
    const params = new URLSearchParams();
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    updateFilters(newPage, limit);
  };

  const handleLimitChange = (newLimit: number | 'all') => {
    updateFilters(1, newLimit);
  };

  const handleCreateSuperhero = () => {
    setEditingSuperhero(null);
    setIsFormOpen(true);
  };

  const handleEditSuperhero = (superhero: SuperheroEntity) => {
    setEditingSuperhero(superhero);
    setIsFormOpen(true);
  };

  const handleDeleteSuperhero = (id: string) => {
    setDeletingSuperheroId(id);
  };

  const handleFormSubmit = (formData: CreateSuperheroRequest | UpdateSuperheroRequest) => {
    if (editingSuperhero) {
      const { id } = editingSuperhero;
      updateSuperhero(
        { id, data: formData as UpdateSuperheroRequest },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingSuperhero(null);
          },
        },
      );
    } else {
      createSuperhero(formData as CreateSuperheroRequest, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingSuperhero(null);
  };

  const confirmDelete = () => {
    if (deletingSuperheroId) {
      deleteSuperhero(deletingSuperheroId, {
        onSettled: () => {
          setDeletingSuperheroId(null);
        },
      });
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-foreground mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">Failed to load superheroes. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Superheroes Catalog</h1>
        </div>
        <Button onClick={handleCreateSuperhero} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Superhero
        </Button>
      </div>

      {isLoading && <Loader />}

      {data && (
        <>
          <SuperheroList
            superheroes={data.data}
            onEdit={handleEditSuperhero}
            onDelete={handleDeleteSuperhero}
          />

          {data.totalPages > 1 || limit !== 'all' ? (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              limit={limit}
              total={data.total}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          ) : null}
        </>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSuperhero ? 'Edit Superhero' : 'Create New Superhero'}
            </DialogTitle>
          </DialogHeader>
          <SuperheroForm
            superhero={editingSuperhero || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingSuperheroId} onOpenChange={() => setDeletingSuperheroId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Superhero</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this superhero? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CatalogPage;
