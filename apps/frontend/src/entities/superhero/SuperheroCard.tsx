import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import type { SuperheroEntity } from '../../../../../packages/types/types';

interface SuperheroCardProps {
  superhero: SuperheroEntity;
  onEdit?: (superhero: SuperheroEntity) => void;
  onDelete?: (id: string) => void;
}

export function SuperheroCard({ superhero, onEdit, onDelete }: SuperheroCardProps) {
  const getPrimaryImage = () => {
    if (superhero.images.length === 0) return null;
    const lgImage = superhero.images.find(img => img.url.includes('/lg/'));
    return lgImage || superhero.images[0];
  };

  const primaryImage = getPrimaryImage();

  return (
    <Card className="h-full flex p-0 flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative aspect-[3/4] overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={superhero.nickname}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl text-gray-400">🦸</div>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4 pt-0 pb-0">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{superhero.nickname}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{superhero.realName}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {superhero.originDescription || 'No origin description available.'}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link to={`/${superhero.id}`}>
            <Eye className="w-4 h-4 mr-1" />
            View
          </Link>
        </Button>

        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(superhero)}>
            <Edit className="w-4 h-4" />
          </Button>
        )}

        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(superhero.id)}
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
