import TaiChiDiagram from "@/components/bagua/TaiChiDiagram";
import {useUIStore} from "@/stores/uiStore";
import {ModalType} from "@/types/common";


interface ProofSystemProps {
    defaultBinary?: string;
}

export const IChingProofSystem = ({ defaultBinary = "111111" }: ProofSystemProps) => {
    const { openModal } = useUIStore();
    // const hexagrams = useIChing();
    // console.log(hexagrams);
    // const hexagram = hexagrams[binary];
    // const gua = Gua.createFromBinary(binary);
    // const yaos = YAO.fakeCreateFromBinary(binary);

    // const [binary, setBinary] = useState(defaultBinary);
    // const [hexagram, setHexagram] = useState<IChing | null>(null);
    // const [gua, setGua] = useState<Gua | null>(null);
    // const [yaos, setYaos] = useState<YAO[]>([]);
    // useEffect(() => {
    //     const hexagram = hexagrams[binary];
    //     const gua = Gua.createFromBinary(binary);
    //     const yaos = YAO.fakeCreateFromBinary(binary);
    //     setHexagram(hexagram);
    //     setGua(gua);
    //     setYaos(yaos);
    // }, [binary]);


    return (
        <div className="max-w-4xl mx-auto ">
            <div className="rounded-xl  backdrop-blur-sm bg-black/20 p-8 mt-4">
                <div className="flex flex-col items-center justify-center">
                    <h3 className="text-xl text-purple-300 mb-6">How I Ching Divination Works</h3>

                    <div className="text-white/70 mb-8 text-left max-w-2xl mx-auto">
                        <p className="mb-4">
                            Treat the  I Ching Divination process like a three-color zero-knowledge prove process.
                        </p>

                        <div className="space-y-2 my-4">
                            <p>The <span className="text-purple-300 font-medium">Verifier</span> is the user who uses the divination system to know how Will manifests in the future.
                                The <span className="text-purple-300 font-medium">Prover</span> is the Unknowable who gives a proof about the manifestation in the future.</p>
                            <p>The Verifier can verify the proof in the future.</p>
                        </div>

                        <p className="my-4"></p>

                        <div className="mt-6 p-3 border border-purple-500/30 rounded-lg bg-black/30">
                            <p className="italic">Always remember, the prerequisite of the proof is the Verifier's divination is:
                                {/* "不诚不占，不疑不占，不义不占" */}
                            </p>
                            {/* <p className="font-medium text-purple-200 my-2">"不诚不占，不疑不占，不义不占"</p> */}
                            <p className="text-yellow-200 font-medium">Please be honest, be faithful, and be righteous for the wills. Always keep it in mind - Love is the answer for everything.</p>
                        </div>
                    </div>


                    <div className="mb-6 m-8 w-full h-full flex justify-center items-center animate-[spin_256s_linear_infinite]">
                        <TaiChiDiagram onItemClick={(item) => {
                            openModal(ModalType.GUA, item);
                        }} className="w-[100%] h-[100%]" />
                    </div>

                    <div className="text-sm text-white/50 mt-4 text-left max-w-lg space-y-2">
                        <ul className="list-disc list-inside text-xs space-y-1 pt-2">
                            <li>The I Ching (Book of Changes) - Ancient Chinese divination text</li>
                            <li>Tao Te Ching by Lao Tzu - Foundational text of Taoist philosophy</li>
                            <li>The Complete I Ching by Alfred Huang - Modern interpretation</li>
                            <li>The Tao of Physics by Fritjof Capra - Connecting Eastern mysticism with modern physics</li>
                            <li>Jung and the I Ching by Karcher and Ritsema - Psychological perspective</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div >
    );
};