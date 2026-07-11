import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw, AlertCircle, Trash2, ArrowRight, Zap, Trophy, Coins, ShoppingBag } from 'lucide-react';

import { PetProvider } from './context/PetContext';
import { usePet } from './hooks/usePet';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageContainer } from './components/layout/PageContainer';
import { Hero } from './components/hero/Hero';
import { UploadCard } from './components/cards/UploadCard';
import { GenerateCard } from './components/cards/GenerateCard';
import { PrimaryButton } from './components/buttons/PrimaryButton';
import { SecondaryButton } from './components/buttons/SecondaryButton';
import { FloatingBackground } from './components/illustrations/FloatingBackground';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Modal } from './components/ui/Modal';
import { Tooltip } from './components/ui/Tooltip';
import { EventBus } from './ai/EventBus';

import { UploadZone } from './components/upload/UploadZone';
import { PromptModal } from './components/generate/PromptModal';
import { PetPreview } from './components/preview/PetPreview';

import { usePetStore } from './store/petStore';
import { PetCanvas } from './components/pet/PetCanvas';

// Inner component to safely consume Pet Context
const MainAppContent: React.FC = () => {
  const {
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
    isLoading,
    createPet,
    resetState,
    savedPets,
    deletePet,
    setActivePet,
    currentView,
    setCurrentView,
    previewPet,
    setPreviewPet
  } = usePet();

  // Zustand state management for care parameters
  const {
    hunger,
    energy,
    coins,
    experience,
    level,
    feedPet,
    playWithPet,
    sleepPet,
    addCoins,
    equippedAccessories,
    equipAccessory,
    unequipAccessory,
    setActivePet: setStoreActivePet,
  } = usePetStore();

  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedPetName, setConfirmedPetName] = useState("");

  // Sync active companion with global engine canvas store
  React.useEffect(() => {
    setStoreActivePet(activePet);
  }, [activePet, setStoreActivePet]);

  // Track purchased items
  const [purchasedAccessories, setPurchasedAccessories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('digital_pets_purchased_acc');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const SHOP_ITEMS = [
    { id: 'sunglasses', name: 'Pixel Shades', icon: '🕶️', price: 15, desc: 'Cool retro gamer specs' },
    { id: 'crown', name: 'Royal Crown', icon: '👑', price: 30, desc: 'A dazzling crown for royalty' },
    { id: 'party-hat', name: 'Party Hat', icon: '🥳', price: 20, desc: 'Ready for celebration' },
    { id: 'bow-tie', name: 'Red Bow Tie', icon: '🎀', price: 10, desc: 'Extremely dapper and formal' },
  ];

  const handleAccessoryClick = (item: typeof SHOP_ITEMS[0]) => {
    const isPurchased = purchasedAccessories.includes(item.id);
    const isEquipped = equippedAccessories.includes(item.id);

    if (isPurchased) {
      if (isEquipped) {
        unequipAccessory(item.id);
      } else {
        equipAccessory(item.id);
      }
    } else {
      if (coins >= item.price) {
        addCoins(-item.price);
        const updated = [...purchasedAccessories, item.id];
        setPurchasedAccessories(updated);
        localStorage.setItem('digital_pets_purchased_acc', JSON.stringify(updated));
        equipAccessory(item.id);
        usePetStore.getState().speak(`Wow! Bought and equipped the ${item.name}! 🛍️`, 3500);
      } else {
        alert("You need more coins! Play with your companion to earn gold. 🪙");
      }
    }
  };

  const handleUploadSuccess = (id: string, url: string) => {
    setPreviewPet({
      id,
      url,
      method: "upload",
    });
    setCurrentView("preview");
  };

  const handleGenerateSuccess = (id: string, url: string, promptUsed: string) => {
    setIsPromptModalOpen(false);
    setPreviewPet({
      id,
      url,
      method: "generate",
      prompt: promptUsed,
    });
    setCurrentView("preview");
  };

  const handleConfirmCreate = async (name: string) => {
    if (!previewPet) return;
    setConfirmedPetName(name);
    const success = await createPet(name, previewPet.url, previewPet.method);
    if (success) {
      setIsSuccessModalOpen(true);
    }
  };

  const handleCancelPreview = () => {
    setCurrentView("landing");
    setPreviewPet(null);
  };

  const isContinueEnabled = 
    selectedMethod !== null && 
    (selectedMethod === 'upload' ? !!uploadedImageUrl : !!aiPrompt.trim());

  return (
    <div className="relative min-h-screen bg-[#F9F9FB] text-[#1A1A1E] flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Immersive background decoration */}
      <FloatingBackground />

      {/* Brand Navigation */}
      <Navbar />

      <PageContainer>
        {/* If user has an active pet, show their active workspace dashboard */}
        <AnimatePresence mode="wait">
          {activePet ? (
            <motion.div
              key="active-dashboard"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="max-w-4xl mx-auto w-full bg-white border border-[#E2E4E9] shadow-md rounded-3xl p-6 md:p-8 relative overflow-hidden"
              id="active-companion-panel"
            >
              {/* Top Header Row with Coins & Method Badge */}
              <div className="flex items-center justify-between w-full border-b border-[#E2E4E9] pb-4 mb-6">
                <div className="flex items-center gap-2 bg-[#FFFDF0] border border-[#FFD166]/30 px-3.5 py-1.5 rounded-full shadow-2xs">
                  <Coins className="w-4 h-4 text-[#FFD166] fill-[#FFD166]" />
                  <span className="text-sm font-extrabold text-[#9A7D0A] tracking-wide">{coins} <span className="text-xs font-bold">Gold</span></span>
                </div>
                
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${
                  activePet.method === 'upload' 
                    ? 'text-[#FF7EA5] bg-[#FFF0F5] border-[#FF7EA5]/20' 
                    : 'text-[#8338EC] bg-[#F5F3FF] border-[#8338EC]/20'
                }`}>
                  {activePet.method === 'upload' ? 'Custom PNG Companion' : 'AI summon'}
                </span>
              </div>

              {/* Main Two-Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-left">
                
                {/* Column 1: Character Stage & Profile Info */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-[#E2E4E9] pb-6 md:pb-0 md:pr-8">
                  {/* Avatar Display Frame */}
                  <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
                    <div className="absolute inset-[-12px] bg-gradient-to-tr from-[#FFFDF0] via-[#FFF0F5] to-[#F5F3FF] rounded-full border-2 border-dashed border-[#E2E4E9] animate-spin-[35s]" />
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative w-36 h-36 flex items-center justify-center drop-shadow-xl z-10"
                    >
                      <img
                        src={activePet.imageUrl}
                        alt={activePet.name}
                        className="max-w-full max-h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  </div>

                  {/* Profile Metadata */}
                  <div className="w-full flex flex-col items-center md:items-start">
                    <h2 className="text-3xl font-extrabold text-[#1A1A1E] tracking-tight mb-1 flex items-center gap-2">
                      {activePet.name} <Heart className="w-5 h-5 text-[#FF7EA5] fill-[#FF7EA5] animate-pulse" />
                    </h2>
                    <p className="text-xs text-[#9E9EAF] font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-[#FFD166] fill-[#FFD166]" /> Level {level} Digital Companion
                    </p>

                    {/* Level Experience Meter */}
                    {(() => {
                      const currentLevelExp = (level - 1) * (level - 1) * 10;
                      const nextLevelExp = level * level * 10;
                      const progress = Math.max(0, Math.min(100, ((experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100));
                      return (
                        <div className="w-full max-w-xs mt-1 bg-gray-100 rounded-full h-3 relative overflow-hidden border border-gray-100">
                          <div
                            className="bg-[#8338EC] h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                          <span className="absolute right-2 top-0 text-[8px] font-extrabold text-[#5C5F6A] leading-tight mt-[1px]">
                            {experience} / {nextLevelExp} EXP
                          </span>
                        </div>
                      );
                    })()}

                    <p className="text-xs text-[#5C5F6A] mt-4 leading-relaxed font-medium">
                      👋 Double-click your floating desktop friend anytime to make them jump or earn experience!
                    </p>
                  </div>
                </div>

                {/* Column 2: Stats & Care Panel + Accessory Closets */}
                <div className="flex flex-col gap-6">
                  {/* Care Vitals Section */}
                  <div>
                    <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#9E9EAF] mb-3">Vitals & Care</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Hunger State */}
                      <div className="bg-gray-50 border border-[#E2E4E9]/50 rounded-2xl p-3.5 flex flex-col gap-1">
                        <div className="flex justify-between items-center text-xs font-bold text-[#1A1A1E]">
                          <span className="flex items-center gap-1">🍖 Hunger</span>
                          <span className={`${hunger > 50 ? 'text-[#06D6A0]' : hunger > 20 ? 'text-[#FFD166]' : 'text-[#FF6492]'}`}>
                            {Math.round(hunger)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              hunger > 50 ? 'bg-[#06D6A0]' : hunger > 20 ? 'bg-[#FFD166]' : 'bg-[#FF6492]'
                            }`}
                            style={{ width: `${hunger}%` }}
                          />
                        </div>
                      </div>

                      {/* Energy State */}
                      <div className="bg-gray-50 border border-[#E2E4E9]/50 rounded-2xl p-3.5 flex flex-col gap-1">
                        <div className="flex justify-between items-center text-xs font-bold text-[#1A1A1E]">
                          <span className="flex items-center gap-1">⚡ Energy</span>
                          <span className={`${energy > 50 ? 'text-[#118AB2]' : 'text-[#FF6492]'}`}>
                            {Math.round(energy)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              energy > 50 ? 'bg-[#118AB2]' : 'bg-[#FF6492]'
                            }`}
                            style={{ width: `${energy}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Deck */}
                  <div className="flex flex-wrap gap-2.5">
                    <Tooltip content="Feed delicious snacks (-5 coins, +20 hunger, +5 experience)">
                      <button
                        onClick={() => {
                          if (coins >= 5) {
                            feedPet(20);
                            addCoins(-5);
                            EventBus.dispatch("FEED", 20);
                          } else {
                            alert("Not enough coins! Play with your companion to earn some first. 🪙");
                          }
                        }}
                        disabled={hunger >= 100}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-3 bg-[#FFFDF0] hover:bg-[#FFF9D4] text-[#9A7D0A] border border-[#FFD166]/30 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                      >
                        🍪 Feed Snack
                      </button>
                    </Tooltip>

                    <Tooltip content="Play custom tag game (-15 energy, +15 coins, +25 experience)">
                      <button
                        onClick={() => {
                          if (energy >= 15) {
                            playWithPet(15, 25, 15);
                            EventBus.dispatch("PLAY", { boredom: -30 });
                          } else {
                            alert("Your companion is too exhausted! Let them take a nap first. 🛌");
                          }
                        }}
                        disabled={energy < 15}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-3 bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#8338EC] border border-[#8338EC]/10 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                      >
                        🏃‍♂️ Play Tag
                      </button>
                    </Tooltip>

                    <Tooltip content="Take a short nap (+35 energy)">
                      <button
                        onClick={() => {
                          sleepPet(35);
                          EventBus.dispatch("PLAY", { boredom: 0 });
                        }}
                        disabled={energy >= 100}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-3 bg-[#EAF5FF] hover:bg-[#D4EAFF] text-[#118AB2] border border-[#118AB2]/10 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                      >
                        🛌 Take Nap
                      </button>
                    </Tooltip>
                  </div>

                  {/* Accessory Store & Closet */}
                  <div className="border-t border-[#E2E4E9] pt-4 mt-2">
                    <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#9E9EAF] mb-3 flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#8338EC]" /> Accessory Store & Closet
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {SHOP_ITEMS.map((item) => {
                        const isPurchased = purchasedAccessories.includes(item.id);
                        const isEquipped = equippedAccessories.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleAccessoryClick(item)}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isEquipped
                                ? 'bg-[#F5F3FF] border-[#8338EC] text-[#8338EC]'
                                : isPurchased
                                ? 'bg-gray-50 border-[#E2E4E9] hover:bg-gray-100 text-[#1A1A1E]'
                                : 'bg-white border-[#E2E4E9]/60 hover:border-gray-300 text-[#5C5F6A]'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-lg">{item.icon}</span>
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold truncate leading-tight">{item.name}</p>
                                <p className="text-[9px] text-[#9E9EAF] font-medium leading-tight truncate">{item.desc}</p>
                              </div>
                            </div>
                            <div className="text-[10px] font-extrabold flex-shrink-0">
                              {isEquipped ? (
                                <span className="text-[#8338EC]">Equipped</span>
                              ) : isPurchased ? (
                                <span className="text-gray-500">Wear</span>
                              ) : (
                                <span className="text-[#9A7D0A] flex items-center gap-0.5">
                                  🪙{item.price}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

              {/* Reset / Change buttons */}
              <div className="flex items-center justify-center gap-3 border-t border-[#E2E4E9] mt-8 pt-6 w-full">
                <SecondaryButton onClick={resetState} icon={RefreshCw} id="change-pet-button">
                  Choose Another Companion
                </SecondaryButton>
              </div>
            </motion.div>

          ) : currentView === 'preview' && previewPet ? (
            /* Show Pet Review Screen */
            <PetPreview
              id={previewPet.id}
              url={previewPet.url}
              type={previewPet.method}
              prompt={previewPet.prompt}
              onConfirm={handleConfirmCreate}
              onCancel={handleCancelPreview}
            />
          ) : (
            /* Otherwise, show standard landing page */
            <div key="landing-page" className="flex flex-col items-center">
              {/* Primary landing screen title */}
              <Hero />

              {/* Two Column Configuration Deck */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full max-w-4xl mb-10 md:mb-12">
                <UploadCard
                  selected={selectedMethod === 'upload'}
                  onSelect={() => setSelectedMethod('upload')}
                  uploadedFile={uploadedFile}
                  uploadedImageUrl={uploadedImageUrl}
                  onFileUploaded={handleFileUpload}
                  onFileCleared={clearUploadedFile}
                  id="choice-upload"
                />

                <GenerateCard
                  selected={selectedMethod === 'generate'}
                  onSelect={() => setSelectedMethod('generate')}
                  promptValue={aiPrompt}
                  onPromptChange={setAiPrompt}
                  id="choice-generate"
                />
              </div>

              {/* Central Continue Trigger bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 w-full max-w-md bg-white border border-[#E2E4E9] p-6 rounded-2xl shadow-xs"
              >
                <div className="text-center w-full">
                  <p className="text-xs font-extrabold tracking-wider uppercase text-[#9E9EAF] mb-1">
                    Companion Status
                  </p>
                  
                  {selectedMethod === 'upload' ? (
                    <div className="w-full mt-2">
                      <UploadZone onSuccess={handleUploadSuccess} />
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-[#5C5F6A] font-medium leading-relaxed">
                        {!selectedMethod 
                          ? "Choose a creation method above to begin." 
                          : "Describe your pet in the generator card and click configure to proceed!"
                        }
                      </p>
                      
                      {selectedMethod === 'generate' && (
                        <div className="w-full mt-4">
                          <PrimaryButton
                            onClick={() => setIsPromptModalOpen(true)}
                            color="purple"
                            fullWidth
                            icon={ArrowRight}
                            id="landing-continue"
                          >
                            Configure & Summon
                          </PrimaryButton>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Loading Spinner for generation state */}
        <AnimatePresence>
          {isLoading && (
            <div className="fixed inset-0 bg-white/70 backdrop-blur-xs z-50 flex items-center justify-center">
              <LoadingSpinner text="Summoning your companion from the digital ether..." size="lg" />
            </div>
          )}
        </AnimatePresence>

        {/* Saved Companions Gallery */}
        {savedPets.length > 0 && !activePet && (
          <div className="mt-16 border-t border-[#E2E4E9] pt-12 max-w-4xl mx-auto w-full" id="saved-pets-gallery">
            <h3 className="text-lg font-bold text-[#1A1A1E] mb-6 tracking-tight text-center flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD166] fill-[#FFD166]" /> Your Companion Collection ({savedPets.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {savedPets.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[#E2E4E9] rounded-xl p-4 flex flex-col items-center text-center relative group hover:shadow-xs transition-all"
                >
                  <button
                    onClick={() => deletePet(p.id)}
                    className="absolute top-2 right-2 p-1.5 bg-[#FFF0F5] hover:bg-[#FF6492]/10 text-[#FF6492] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Delete pet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-2">
                    <img src={p.imageUrl} alt={p.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  
                  <p className="text-xs font-bold text-[#1A1A1E] leading-tight truncate w-full">{p.name}</p>
                  <p className="text-[9px] text-[#9E9EAF] font-bold uppercase tracking-wider mt-0.5">{p.method}</p>
                  
                  <button
                    onClick={() => setActivePet(p)}
                    className="mt-3 text-[10px] font-bold text-[#8338EC] hover:text-[#7226DB] border border-[#8338EC]/20 hover:bg-[#F5F3FF] px-2 py-1 rounded-md transition-all cursor-pointer"
                  >
                    Activate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageContainer>

      {/* Footer Branding */}
      <Footer />

      {/* Prompt Modal for AI Generation */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onSuccess={handleGenerateSuccess}
      />

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Companion Created Successfully! ✨"
        id="success-pet-modal"
        footer={
          <PrimaryButton 
            onClick={() => setIsSuccessModalOpen(false)} 
            color="green"
            id="success-modal-close"
          >
            Awesome!
          </PrimaryButton>
        }
      >
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="w-16 h-16 rounded-full bg-[#F0FFF4] border border-[#06D6A0]/20 flex items-center justify-center text-[#06D6A0] mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-lg text-[#1A1A1E]">{confirmedPetName} is officially alive!</h4>
          <p className="text-xs text-[#5C5F6A] leading-relaxed max-w-sm">
            Congratulations! Your new virtual friend has been saved to your browser collection and is ready to float, play, and explore.
          </p>
        </div>
      </Modal>
    </div>
  );
};

// Wrapper with Provider
export default function App() {
  return (
    <PetProvider>
      <MainAppContent />
      <PetCanvas />
    </PetProvider>
  );
}
