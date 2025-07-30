'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Store, 
  Plus,
  Trash,
  Tractor,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import CoverImageUpload from './cover-image-upload';

// Basic types for our store management
interface VendorStore {
  id?: string;
  name: string;
  description: string;
  type: string;
  isActive: boolean;
  isPrimary?: boolean;
  imageUrl?: string; // Store cover image URL
}

interface ManageStoresProps {
  userId: string;
  existingStores: VendorStore[];
}

export default function ManageStores({ userId, existingStores }: ManageStoresProps) {
  const [stores, setStores] = useState<VendorStore[]>(existingStores || []);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newStore, setNewStore] = useState<VendorStore>({
    name: '',
    description: '',
    type: 'Farm',
    isActive: true,
    imageUrl: '',
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewStore({ ...newStore, [name]: value });
  };

  // Create a new store
  const handleCreateStore = async () => {
    if (!newStore.name) {
      toast.error('Please enter a store name');
      return;
    }
    
    if (!newStore.imageUrl) {
      toast.error('Please upload a store cover image');
      return;
    }

    if (stores.length >= 2) {
      toast.error('You can only have a maximum of 2 stores/farms');
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would be a fetch call to your API
      // For now we're just simulating it
      const isPrimary = stores.length === 0;
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const createdStore = {
        ...newStore,
        id: `store_${Date.now()}`,
        isPrimary
      };
      
      setStores([...stores, createdStore]);
      setNewStore({
        name: '',
        description: '',
        type: 'Farm',
        isActive: true,
        imageUrl: '',
      });
      setIsCreating(false);
      toast.success('Store created successfully');
    } catch (error) {
      toast.error('Failed to create store');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Set a store as primary
  const handleSetPrimary = async (storeId: string) => {
    setLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedStores = stores.map(store => ({
        ...store,
        isPrimary: store.id === storeId
      }));
      
      setStores(updatedStores);
      toast.success('Primary store updated');
    } catch (error) {
      toast.error('Failed to update primary store');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a store
  const handleDeleteStore = async (storeId: string) => {
    if (!confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filteredStores = stores.filter(store => store.id !== storeId);
      
      // If the deleted store was primary, set the first remaining store as primary
      if (filteredStores.length > 0 && stores.find(s => s.id === storeId)?.isPrimary) {
        filteredStores[0].isPrimary = true;
      }
      
      setStores(filteredStores);
      toast.success('Store deleted successfully');
    } catch (error) {
      toast.error('Failed to delete store');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="dark:bg-zinc-900/50 dark:border-zinc-800 dark:backdrop-blur-sm dark:shadow-lg dark:shadow-emerald-900/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 dark:text-agricultural-100">
            <Store className="h-5 w-5 dark:text-agricultural-400" />
            <span className="bg-clip-text bg-gradient-to-r from-agricultural-500 to-emerald-400 dark:from-agricultural-300 dark:to-emerald-300 text-transparent font-medium">Your Stores/Farms</span>
          </CardTitle>
          {!isCreating && stores.length < 2 && (
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-agricultural-500 hover:bg-agricultural-600 dark:bg-agricultural-700 dark:hover:bg-agricultural-600 dark:text-white dark:border-none transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Store/Farm
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isCreating ? (
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-zinc-800/50 dark:border-zinc-700 dark:backdrop-blur-sm">
              <h3 className="font-medium dark:text-agricultural-300">Create New Store/Farm</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-agricultural-300">Store/Farm Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newStore.name}
                    onChange={handleInputChange}
                    placeholder="Enter store name"
                    className="bg-white dark:bg-zinc-800 dark:text-agricultural-200 dark:border-zinc-700 dark:placeholder:text-zinc-500 focus-visible:ring-agricultural-500 dark:focus-visible:ring-agricultural-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="dark:text-agricultural-300">Store/Farm Type</Label>
                  <Input
                    id="type"
                    name="type"
                    value={newStore.type}
                    onChange={handleInputChange}
                    placeholder="e.g., Farm, Distributor, Processor"
                    className="bg-white dark:bg-zinc-800 dark:text-agricultural-200 dark:border-zinc-700 dark:placeholder:text-zinc-500 focus-visible:ring-agricultural-500 dark:focus-visible:ring-agricultural-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="dark:text-agricultural-300">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newStore.description}
                    onChange={handleInputChange}
                    placeholder="Describe your store/farm"
                    rows={3}
                    className="bg-white dark:bg-zinc-800 dark:text-agricultural-200 dark:border-zinc-700 dark:placeholder:text-zinc-500 focus-visible:ring-agricultural-500 dark:focus-visible:ring-agricultural-400 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="dark:text-agricultural-300">Store Cover Image</Label>
                    <div className="text-xs text-agricultural-600 dark:text-agricultural-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>Required</span>
                    </div>
                  </div>
                  <div className="mt-1">
                    <CoverImageUpload
                      initialImage={newStore.imageUrl || null}
                      userId={userId}
                      formAction="/api/vendors/image"
                      imageType="store"
                      onImageUpdate={(url: string) => {
                        setNewStore(prev => ({ ...prev, imageUrl: url }))
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreating(false)}
                    disabled={loading}
                    className="dark:bg-zinc-800 dark:text-agricultural-300 dark:hover:bg-zinc-700 dark:border-zinc-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateStore}
                    className="bg-agricultural-500 hover:bg-agricultural-600 dark:bg-agricultural-700 dark:hover:bg-agricultural-600 dark:text-white transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Store'}
                  </Button>
                </div>
              </div>
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-8">
              <Tractor className="h-10 w-10 mx-auto text-gray-400 dark:text-agricultural-500/40 mb-2" />
              <p className="text-muted-foreground dark:text-agricultural-400/70">You don't have any stores/farms yet</p>
              <Button 
                className="mt-4 bg-agricultural-500 hover:bg-agricultural-600 dark:bg-agricultural-700 dark:hover:bg-agricultural-600 dark:text-white transition-all duration-200"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Store/Farm
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <div 
                  key={store.id} 
                  className={`border rounded-lg p-4 flex justify-between items-center ${
                    store.isPrimary 
                      ? 'border-agricultural-500 bg-agricultural-50 dark:border-agricultural-600/50 dark:bg-agricultural-900/30' 
                      : 'dark:border-zinc-700 dark:bg-zinc-800/50'
                  } transition-all duration-200 hover:shadow-sm dark:hover:shadow-agricultural-900/20`}
                >
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2 dark:text-agricultural-100">
                      {store.name}
                      {store.isPrimary && (
                        <Badge className="bg-agricultural-500 text-white dark:bg-agricultural-600">Primary</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-agricultural-400">{store.type}</p>
                    <p className="text-sm dark:text-zinc-400">{store.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!store.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimary(store.id!)}
                        disabled={loading}
                        className="dark:bg-zinc-800 dark:text-agricultural-300 dark:hover:bg-zinc-700 dark:border-zinc-700"
                      >
                        Set Primary
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 dark:text-red-400 dark:border-zinc-700 dark:hover:bg-zinc-700/80 dark:hover:text-red-300"
                      onClick={() => handleDeleteStore(store.id!)}
                      disabled={loading}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 dark:text-agricultural-400 dark:hover:bg-zinc-800 dark:hover:text-agricultural-300"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
