import {ChevronDown, GripHorizontal, LogOut} from "lucide-react";
import {Button} from "../../../components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog.tsx";
import {useState} from "react";

interface ResultPanelHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ResultPanelHeader = ({
  isOpen,
  onToggle
}: ResultPanelHeaderProps) => {
  const navigate = useNavigate();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleExit = () => {
    setShowExitDialog(false);
    navigate('/');
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5 rounded-t-lg">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowExitDialog(true)} 
          className="h-7 w-7 p-0 text-[#9b87f5] hover:text-[#D6BCFA]"
        >
          <LogOut className="h-4 w-4 transform rotate-180" />
        </Button>
        <h3 className="text-sm font-medium text-[#9b87f5] absolute left-1/2 -translate-x-1/2">
          Actions Panel
        </h3>
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-[#9b87f5]" />
          <button onClick={onToggle} className="text-[#9b87f5] hover:text-[#D6BCFA] transition-colors">
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="bg-[#1A1F2C] border border-white/5 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#9b87f5]">Exit Confirmation</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to exit? Any unsaved progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="border-[#3A3F4C] hover:bg-[#3A3F4C] text-[#9b87f5]">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleExit}
              className="bg-[#9b87f5] hover:bg-[#D6BCFA] text-white"
            >
              Exit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
