

{/* <Button
variant="ghost"
size="sm"
// className="h-8 px-3 text-indigo-300 hover:bg-indigo-900/30 hover:text-indigo-200 transition-all duration-300"
// className="flex items-center justify-center gap-2"
// className= "bg-indigo-900/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50"
className= "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white border border-indigo-500/50 shadow-lg shadow-indigo-900/20"
onClick={() => openModal(ModalType.WILL_SIGNATURE)}
>
{willSignature !== '' ? 'View Divinable Proof' : 'Sign to Prove it is Divineable'}
</Button> */
}

import React from 'react';
import {Button, ButtonProps} from '../button';

interface NiceButtonProps extends ButtonProps {
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'default';
  onClick?: () => void;
  children: React.ReactNode;
}


export const NiceButton: React.FC<NiceButtonProps> = ({ variant = 'default', size = 'default', onClick, children, ...props }) => {
  return (
    <Button
      variant={variant}
      size={size}
      className= "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white border border-indigo-500/50 shadow-lg shadow-indigo-900/20"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
