import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

export type PetMethod = 'upload' | 'generate' | null;

export interface Pet {
  id: string;
  name: string;
  imageUrl: string;
  method: 'upload' | 'generate';
  createdAt: string;
  isCustomized?: boolean;
}

interface PetContextType {
  selectedMethod: PetMethod;
  setSelectedMethod: (method: PetMethod) => void;
  uploadedFile: File | null;
  uploadedImageUrl: string | null;
  handleFileUpload: (file: File) => void;
  clearUploadedFile: () => void;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  petName: string;
  setPetName: (name: string) => void;
  activePet: Pet | null;
  setActivePet: (pet: Pet | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  createPet: () => Promise<boolean>;
  resetState: () => void;
  savedPets: Pet[];
  deletePet: (id: string) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMethod, setSelectedMethod] = useState<PetMethod>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [petName, setPetName] = useState<string>('');
  const [activePet, setActivePet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedPets, setSavedPets] = useState<Pet[]>([]);

  // Load active pet and saved pets from localStorage on mount
  useEffect(() => {
    const storedActive = localStorage.getItem('digital_pets_active');
    if (storedActive) {
      try {
        setActivePet(JSON.parse(storedActive));
      } catch (e) {
        console.error('Error parsing active pet', e);
      }
    }

    const storedSaved = localStorage.getItem('digital_pets_list');
    if (storedSaved) {
      try {
        setSavedPets(JSON.parse(storedSaved));
      } catch (e) {
        console.error('Error parsing saved pets', e);
      }
    }
  }, []);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setUploadedImageUrl(url);
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
      setUploadedImageUrl(null);
    }
  };

  const deletePet = (id: string) => {
    const updated = savedPets.filter(p => p.id !== id);
    setSavedPets(updated);
    localStorage.setItem('digital_pets_list', JSON.stringify(updated));
    if (activePet?.id === id) {
      setActivePet(null);
      localStorage.removeItem('digital_pets_active');
    }
  };

  const resetState = () => {
    setSelectedMethod(null);
    clearUploadedFile();
    setAiPrompt('');
    setPetName('');
    setIsLoading(false);
  };

  const createPet = async (): Promise<boolean> => {
    if (!petName.trim()) return false;
    
    setIsLoading(true);
    
    // Simulate API network latency (placeholder backend connection)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let imageUrl = '';
    
    if (selectedMethod === 'upload' && uploadedImageUrl) {
      imageUrl = uploadedImageUrl;
    } else if (selectedMethod === 'generate') {
      // Create a nice styled placeholder based on prompt or seed (using a highly reliable animal avatar generator URL)
      const promptSeed = encodeURIComponent(aiPrompt || 'corgi');
      imageUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${promptSeed}`;
    } else {
      setIsLoading(false);
      return false;
    }

    const newPet: Pet = {
      id: Date.now().toString(),
      name: petName.trim(),
      imageUrl,
      method: selectedMethod as 'upload' | 'generate',
      createdAt: new Date().toISOString()
    };

    setActivePet(newPet);
    const updatedList = [newPet, ...savedPets];
    setSavedPets(updatedList);
    
    localStorage.setItem('digital_pets_active', JSON.stringify(newPet));
    localStorage.setItem('digital_pets_list', JSON.stringify(updatedList));
    
    setIsLoading(false);
    return true;
  };

  return (
    <PetContext.Provider value={{
      selectedMethod,
      setSelectedMethod,
      uploadedFile,
      uploadedImageUrl,
      handleFileUpload,
      clearUploadedFile,
      aiPrompt,
      setAiPrompt,
      petName,
      setPetName,
      activePet,
      setActivePet,
      isLoading,
      setIsLoading,
      createPet,
      resetState,
      savedPets,
      deletePet
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePetContext must be used within a PetProvider');
  }
  return context;
};
