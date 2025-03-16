
interface StepNumberProps {
  number: number;
  isActive?: boolean;
}

export const StepNumber = ({ number, isActive = true }: StepNumberProps) => (
  <div className={`
    flex items-center justify-center
    w-8 h-8 rounded-full text-base font-medium
    ${isActive 
      ? 'bg-[#9b87f5]/20 text-[#9b87f5]' 
      : 'bg-[#9b87f5]/10 text-[#9b87f5]/50'
    }
  `}>
    {number}
  </div>
);
