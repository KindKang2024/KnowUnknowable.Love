import {Twitter} from "lucide-react";
import {Button} from "../../../components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "../../../components/ui/dialog.tsx";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareImage: string;
  onShare: () => void;
  onDownload: () => void;
}

export const ShareDialog = ({
  open,
  onOpenChange,
  shareImage,
  onShare,
  onDownload,
}: ShareDialogProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    onOpenChange(false);
    navigate("/divination-detail");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C] border border-white/5 text-white">
        <DialogHeader>
          <DialogTitle className="text-[#9b87f5]">Share Your Divine Reading</DialogTitle>
          <DialogDescription className="text-white/60">
            Share your I-Ching reading or view the detailed results
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
            {shareImage && (
              <img
                src={shareImage}
                alt="Divination Result"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleViewDetails}
              className="w-full bg-[#9b87f5] hover:bg-[#9b87f5]/90 text-white"
            >
              View Detailed Results
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={onShare}
                className="flex-1 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Share to Twitter
              </Button>
              <Button
                onClick={onDownload}
                variant="outline"
                className="flex-1 border-[#3A3F4C] hover:bg-[#3A3F4C] text-[#9b87f5]"
              >
                Download Image
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
