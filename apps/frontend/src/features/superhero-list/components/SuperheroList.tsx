import { SuperheroCard } from '../../../entities/superhero/SuperheroCard';
import type { SuperheroEntity } from '../../../../../backend/src/types/types';

interface SuperheroListProps {
  superheroes?: SuperheroEntity[];
  onEdit?: (superhero: SuperheroEntity) => void;
  onDelete?: (id: string) => void;
}

export function SuperheroList({ superheroes = [], onEdit, onDelete }: SuperheroListProps) {
  if (!Array.isArray(superheroes) || superheroes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-foreground mb-2">No superheroes found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or add a new superhero.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {superheroes.map(superhero => (
        <SuperheroCard
          key={superhero.id}
          superhero={superhero}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
