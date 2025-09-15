import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { SuperheroEntity, SuperpowerStats } from '../../../../../../packages/types/types';

interface SuperheroDetailsProps {
  superhero: SuperheroEntity;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SuperheroDetails({ superhero, onEdit, onDelete }: SuperheroDetailsProps) {
  const getPrimaryImage = () => {
    if (superhero.images.length === 0) return null;
    const lgImage = superhero.images.find(img => img.url.includes('/lg/'));
    return lgImage || superhero.images[0];
  };

  const getSuperpowers = (): SuperpowerStats => {
    const defaults: SuperpowerStats = {
      intelligence: 0,
      strength: 0,
      speed: 0,
      durability: 0,
      power: 0,
      combat: 0,
    };
    try {
      const sp: unknown = (superhero as any).superpowers;
      if (!sp) return defaults;
      if (typeof sp === 'string') {
        return JSON.parse(sp) as SuperpowerStats;
      }
      return sp as SuperpowerStats;
    } catch {
      return defaults;
    }
  };

  const primaryImage = getPrimaryImage();
  const superpowers = getSuperpowers();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Link>
        </Button>

        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="overflow-hidden p-0">
            <div className="aspect-[3/4] relative">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={superhero.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-8xl text-gray-400">🦸</div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{superhero.nickname}</CardTitle>
                  <p className="text-xl text-muted-foreground">{superhero.realName}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Catch Phrase</h4>
                  <p className="text-muted-foreground italic">"{superhero.catchPhrase}"</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Origin Story</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {superhero.originDescription || 'No origin description available.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Superpowers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(superpowers).map(([power, value]) => (
                  <div key={power} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">{power}</span>
                      <span className="text-sm text-muted-foreground font-medium">
                        {value as number}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-blue-500 rounded"
                        style={{ width: `${Number(value) || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Created:</span>
                  <p className="text-muted-foreground">
                    {new Date(superhero.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <p className="text-muted-foreground">
                    {new Date(superhero.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
