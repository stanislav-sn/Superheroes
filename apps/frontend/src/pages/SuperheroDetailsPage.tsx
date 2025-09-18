import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { SuperheroDetails } from '../features/superhero-details/components/SuperheroDetails';
import { SuperheroForm } from '../features/superhero-form/components/SuperheroForm';
import { useSuperhero } from '../shared/hooks/useSuperhero';
import { useSuperheroMutations } from '../shared/hooks/useSuperheroMutations';
import type { CreateUpdateSuperheroDTO } from '../types/types';

const SuperheroDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: superhero, isLoading, error } = useSuperhero(id);
  const { updateSuperhero, deleteSuperhero, isUpdating, isDeleting } = useSuperheroMutations();

  const handleEdit = () => {
    setIsEditFormOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (formData: CreateUpdateSuperheroDTO) => {
    if (id) {
      updateSuperhero(
        { id, data: formData },
        {
          onSuccess: () => {
            setIsEditFormOpen(false);
          },
        },
      );
    }
  };

  const handleFormCancel = () => {
    setIsEditFormOpen(false);
  };

  const confirmDelete = () => {
    if (id) {
      deleteSuperhero(id, {
        onSuccess: () => {
          navigate('/', { replace: true });
        },
        onSettled: () => {
          setIsDeleteDialogOpen(false);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <span className="ml-2 text-lg text-foreground">Loading superhero details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium text-foreground mb-2">Superhero Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The superhero you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  if (!superhero) {
    return null;
  }

  return (
    <>
      <SuperheroDetails superhero={superhero} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {superhero.nickname}</DialogTitle>
          </DialogHeader>
          <SuperheroForm
            superhero={superhero}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isUpdating}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {superhero.nickname}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {superhero.nickname}? This action cannot be undone.
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
    </>
  );
};

export default SuperheroDetailsPage;
