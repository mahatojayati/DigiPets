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
  currentView: 'landing' | 'preview';
  setCurrentView: (view: 'landing' | 'preview') => void;
  previewPet: { id: string; url: string; method: 'upload' | 'generate'; prompt?: string } | null;
  setPreviewPet: (pet: { id: string; url: string; method: 'upload' | 'generate'; prompt?: string } | null) => void;
  createPet: (confirmedName: string, confirmedUrl: string, confirmedMethod: 'upload' | 'generate') => Promise<boolean>;
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
  
  // Step 2 client side routing state
  const [currentView, setCurrentView] = useState<'landing' | 'preview'>('landing');
  const [previewPet, setPreviewPet] = useState<{ id: string; url: string; method: 'upload' | 'generate'; prompt?: string } | null>(null);

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
    setCurrentView('landing');
    setPreviewPet(null);
  };

  const createPet = async (
    confirmedName: string,
    confirmedUrl: string,
    confirmedMethod: 'upload' | 'generate'
  ): Promise<boolean> => {
    setIsLoading(true);
    
    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: confirmedName.trim(),
      imageUrl: confirmedUrl,
      method: confirmedMethod,
      createdAt: new Date().toISOString()
    };

    setActivePet(newPet);
    const updatedList = [newPet, ...savedPets];
    setSavedPets(updatedList);
    
    localStorage.setItem('digital_pets_active', JSON.stringify(newPet));
    localStorage.setItem('digital_pets_list', JSON.stringify(updatedList));
    
    setIsLoading(false);
    setCurrentView('landing');
    setPreviewPet(null);
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
      currentView,
      setCurrentView,
      previewPet,
      setPreviewPet,
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
