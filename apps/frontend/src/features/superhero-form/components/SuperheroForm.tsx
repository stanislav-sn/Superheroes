import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Slider } from '../../../components/ui/slider';
import type {
  CreateSuperheroRequest,
  UpdateSuperheroRequest,
  SuperheroEntity,
  SuperpowerStats,
} from '../../../../../backend/src/types/types';

const superheroSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .max(50, 'Nickname must be 50 characters or less'),
  realName: z
    .string()
    .min(1, 'Real name is required')
    .max(100, 'Real name must be 100 characters or less')
    .optional()
    .nullable(),
  originDescription: z
    .string()
    .min(1, 'Origin description must be at least 10 characters')
    .max(1000, 'Origin description must be 1000 characters or less')
    .optional()
    .nullable(),
  catchPhrase: z
    .string()
    .min(1, 'Catch phrase is required')
    .max(200, 'Catch phrase must be 200 characters or less'),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  intelligence: z.number().min(0).max(100),
  strength: z.number().min(0).max(100),
  speed: z.number().min(0).max(100),
  durability: z.number().min(0).max(100),
  power: z.number().min(0).max(100),
  combat: z.number().min(0).max(100),
});

type FormData = z.infer<typeof superheroSchema>;

interface SuperheroFormProps {
  superhero?: SuperheroEntity;
  onSubmit: (data: CreateSuperheroRequest | UpdateSuperheroRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SuperheroForm({ superhero, onSubmit, onCancel, isSubmitting }: SuperheroFormProps) {
  const isEditing = !!superhero;

  const getDefaultValues = (): FormData => {
    if (superhero) {
      let superpowers: SuperpowerStats = {
        intelligence: 50,
        strength: 50,
        speed: 50,
        durability: 50,
        power: 50,
        combat: 50,
      };

      try {
        if (typeof (superhero as any).superpowers === 'string') {
          superpowers = JSON.parse((superhero as any).superpowers);
        } else if (superhero.superpowers) {
          superpowers = superhero.superpowers as unknown as SuperpowerStats;
        }
      } catch {
        console.error('Error parsing superpowers:', superhero);
      }

      const lgImage = superhero.images.find(img => img.url.includes('/lg/'));
      const primaryImage = lgImage
        ? lgImage.url
        : superhero.images.length > 0
          ? superhero.images[0].url
          : '';

      return {
        nickname: superhero.nickname,
        realName: superhero.realName,
        originDescription: superhero.originDescription,
        catchPhrase: superhero.catchPhrase,
        imageUrl: primaryImage,
        intelligence: superpowers.intelligence,
        strength: superpowers.strength,
        speed: superpowers.speed,
        durability: superpowers.durability,
        power: superpowers.power,
        combat: superpowers.combat,
      };
    }

    return {
      nickname: '',
      realName: '',
      originDescription: '',
      catchPhrase: '',
      imageUrl: '',
      intelligence: 50,
      strength: 50,
      speed: 50,
      durability: 50,
      power: 50,
      combat: 50,
    };
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(superheroSchema),
    defaultValues: getDefaultValues(),
  });

  const superpowerKeys = [
    'intelligence',
    'strength',
    'speed',
    'durability',
    'power',
    'combat',
  ] as const;
  type SuperpowerKey = (typeof superpowerKeys)[number];

  const watchedValues = watch(superpowerKeys);

  const handleFormSubmit = (data: FormData) => {
    const superpowers: SuperpowerStats = {
      intelligence: data.intelligence,
      strength: data.strength,
      speed: data.speed,
      durability: data.durability,
      power: data.power,
      combat: data.combat,
    };

    const basePayload: CreateSuperheroRequest = {
      nickname: data.nickname,
      realName: data.realName || '',
      originDescription: data.originDescription || '',
      catchPhrase: data.catchPhrase,
      superpowers,
    };

    if (isEditing) {
      const currentPrimary = (() => {
        if (!superhero) return '';
        const lg = superhero.images.find(img => img.url.includes('/lg/'));
        return lg ? lg.url : (superhero.images[0]?.url ?? '');
      })();
      const trimmedUrl = (data.imageUrl ?? '').trim();
      const images =
        trimmedUrl && trimmedUrl !== currentPrimary ? [{ url: trimmedUrl }] : undefined;

      const updateData: UpdateSuperheroRequest = {
        ...basePayload,
        ...(images ? { images } : {}),
      };
      onSubmit(updateData);
    } else {
      const createData: CreateSuperheroRequest = {
        ...basePayload,
        images: data.imageUrl ? [{ url: data.imageUrl }] : undefined,
      };
      onSubmit(createData);
    }
  };

  const superpowerLabels: Record<SuperpowerKey, string> = {
    intelligence: 'Intelligence',
    strength: 'Strength',
    speed: 'Speed',
    durability: 'Durability',
    power: 'Power',
    combat: 'Combat',
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="nickname">Superhero Nickname *</Label>
            <Input
              className="mt-1"
              id="nickname"
              {...register('nickname')}
              placeholder="Enter superhero nickname"
            />
            {errors.nickname && (
              <p className="text-sm text-red-600 mt-1">{errors.nickname.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="realName">Real Name *</Label>
            <Input
              className="mt-1"
              id="realName"
              {...register('realName')}
              placeholder="Enter real name"
            />
            {errors.realName && (
              <p className="text-sm text-red-600 mt-1">{errors.realName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="catchPhrase">Catch Phrase *</Label>
            <Input
              className="mt-1"
              id="catchPhrase"
              {...register('catchPhrase')}
              placeholder="Enter catch phrase"
            />
            {errors.catchPhrase && (
              <p className="text-sm text-red-600 mt-1">{errors.catchPhrase.message}</p>
            )}
          </div>

          <div>
            <div className="mb-4">
              <Label htmlFor="originDescription">Origin Description *</Label>
              <Textarea
                className="mt-1"
                id="originDescription"
                {...register('originDescription')}
                placeholder="Describe the superhero's origin story"
                rows={4}
              />
              {errors.originDescription && (
                <p className="text-sm text-red-600 mt-1">{errors.originDescription.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              className="mt-1"
              id="imageUrl"
              {...register('imageUrl')}
              placeholder="Enter image URL (optional)"
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.imageUrl.message}</p>
            )}
          </div>
        </div>

        <Card className="pt-4">
          <CardHeader>
            <CardTitle>Superpowers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {superpowerKeys.map((key, index) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <Label>{superpowerLabels[key]}</Label>
                  <span className="text-sm font-medium">{watchedValues[index]}</span>
                </div>
                <Slider
                  value={[watchedValues[index]]}
                  onValueChange={value => setValue(key, value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Superhero' : 'Create Superhero'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
