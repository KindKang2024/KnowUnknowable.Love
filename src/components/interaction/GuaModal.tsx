import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogFooter,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import HexagramCard from '@/pages/divi/components/HexagramCard.tsx';
import {useIChing} from '@/i18n/DataProvider';
import {Gua} from '@/stores/Gua';
import {YAO} from '@/stores/YAO';
import {IChing} from '@/i18n/data_types';

interface GuaModalProps {
    isOpen: boolean;
    binary: string;
    onClose: () => void;
}

// "111": {
//     "name": "乾",
//     "symbol": "☰",
//     "gua_ci": "",
//     "yao_ci": [
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       ""
//     ]
//   },
type Not64GuaData = {
    key: string;
    symbol: string;
    name: string;
    gua_ci: string;
    genetic_code: string;
}

export const GuaModal = ({ isOpen, binary, onClose }: GuaModalProps) => {
    const hexagrams = useIChing();
    // console.log(hexagrams);

    const [gua, setGua] = useState<Gua | null>(null);
    const [yaos, setYaos] = useState<YAO[]>([]);
    const [hexagram, setHexagram] = useState<IChing | null>(null);
    const [not64GuaData, setNot64GuaData] = useState<Not64GuaData | null>(null);
    useEffect(() => {
        const hexagram = hexagrams[binary];
        if (binary.length >= 6) {
            const gua = Gua.fakeCreateFromBinary(binary);
            const yaos = YAO.fakeCreateFromBinary(binary);
            setGua(gua);
            setYaos(yaos);
            setHexagram(hexagram);
        } else {
            setNot64GuaData({
                key: binary,
                symbol: hexagram?.symbol || '',
                name: hexagram?.name || '',
                gua_ci: hexagram?.gua_ci || '',
                genetic_code: Gua.getGeneticCodeFromBinary(binary)
            });
        }
    }, [binary]);


    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-3xl border-purple-800 p-3" >
                <div className="mt-4 bg-white/5 backdrop-blur-sm  border-white/10 p-2 sm:p-3 rounded-xl mb-4 sm:mb-6">
                    {binary.length >= 6 && hexagrams != null && (
                        <div className="mb-2 w-full">
                            <HexagramCard
                                gua={gua}
                                hexagram={hexagram}
                                className="mb-2 w-full"
                            />
                        </div>
                    )}
                    {binary.length < 6 && not64GuaData != null && (
                        <div className="mb-2 w-full">
                            <div className="text-center mb-4">
                                <span className="text-9xl font-bold text-white block">
                                    {not64GuaData?.symbol}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 text-center">
                                {not64GuaData?.name}
                            </div>

                            <div className="text-sm text-gray-500 mt-2">
                                {not64GuaData?.gua_ci}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {not64GuaData?.genetic_code}
                            </div>
                        </div>
                    )}

                </div>

                <DialogFooter className="mt-3 ">
                    <Button onClick={onClose} className="w-full bg-white/80">Close</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};
