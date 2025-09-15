import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
      <span className="ml-2 text-lg text-foreground">Loading superheroes...</span>
    </div>
  );
};

export default Loader;
