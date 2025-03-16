import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "../../../components/ui/dialog.tsx";

interface MeditationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
}

export const MeditationDialog = ({
  open,
  onOpenChange,
  content,
}: MeditationDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-[#1A1F2C] border border-white/5 text-white">
      <DialogHeader>
        <DialogTitle className="text-[#9b87f5]">Divine Meditation</DialogTitle>
        <DialogDescription className="text-white/60">
          DeepSeek's interpretation of your reading
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4 space-y-4">
        <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </DialogContent>
  </Dialog>
);
