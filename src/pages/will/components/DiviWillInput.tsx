import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {ChevronUp, CircleChevronRight, Globe, Lock} from "lucide-react";
import "./DiviWillInput.css";
import {usePageCommonData, usePageWillData} from "@/i18n/DataProvider.tsx";
import {Suggestion, WillPageData} from "@/i18n/data_types.ts";
import {useUIStore} from "@/stores/uiStore.ts";
import {useNavigate} from "react-router-dom";
import {useDivinationStore} from "@/stores/divineStore.ts";
import {routes} from "@/utils/constants.ts";
import {useAccount} from "wagmi";
import {useConnectModal} from "@rainbow-me/rainbowkit";

interface DiviWillInputProps {
    onSubmit?: (message: string) => void;
    readonly?: boolean;
}

export const DiviWillInput = ({ onSubmit, readonly }: DiviWillInputProps) => {
    const willPageData = usePageWillData();
    const commonData = usePageCommonData();

    const navigate = useNavigate();
    const { will, setWill, visibility, setVisibility } = useDivinationStore();
    const pageWillData: WillPageData = usePageWillData();
    const { isConnected, address } = useAccount();
    const { authStatus, setAuthStatus } = useUIStore();
    const { openModal } = useUIStore();
    const { openConnectModal } = useConnectModal();

    // const { data: userData } = useUserData(address);
    // const { mutateAsync: login } = useLogin(address);
    // const { mutateAsync: logout } = useLogout(address);


    const handleSuggestionClick = (suggestion: Suggestion) => {
        const { prefix } = pageWillData.samples.typings;
        if (prefix === "") {
            setWill(suggestion.value);
        } else {
            const fullText = `${prefix} ${suggestion.value}`;
            setWill(fullText);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!will.trim()) return;

        if (!isConnected) {
            openConnectModal();
            return;
        }

        if (authStatus !== 'authenticated') {
            return;
        }

        navigate(routes.divi);

    };

    return (
        <div className="w-full max-w-3xl">
            <div className="relative w-full">
                <div className="flex w-full flex-col items-center px-4">
                    <form
                        onSubmit={handleSubmit}
                        className="duration-125 group flex flex-col gap-2 rounded-xl border border-border bg-card-secondary p-2 transition-colors ease-in-out focus-within:bg-card-hover w-full"
                    >
                        <textarea
                            className="flex w-full rounded-md px-2 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none text-[16px] leading-snug placeholder-shown:text-ellipsis placeholder-shown:whitespace-nowrap md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 max-h-[200px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-secondary bg-transparent focus:bg-transparent"
                            id="chatinput"
                            value={will}
                            onChange={(e) => setWill(e.target.value)}
                            placeholder={willPageData.willDiviTemplate}
                            rows={3}
                            style={{ height: "78px" }}
                        />
                        <div className="flex gap-2 items-center justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-8 px-2 flex items-center gap-1 text-zinc-300 hover:text-zinc-100"
                                    >
                                        <Lock className="h-4 w-4" />
                                        {visibility === 1 ? commonData.public : commonData.private}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[320px] bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                                    <DropdownMenuItem
                                        onClick={() => setVisibility(1)}
                                        className={`flex items-start gap-3 py-3 px-3 text-sm rounded-lg cursor-pointer ${visibility === 1
                                            ? 'bg-zinc-800 text-zinc-100'
                                            : 'text-zinc-300 hover:bg-zinc-800/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center w-5 h-5">
                                            <div className={`w-4 h-4 rounded-full border-2 ${visibility === 1
                                                ? 'border-zinc-300'
                                                : 'border-zinc-600'
                                                } flex items-center justify-center`}>
                                                {visibility === 1 && (
                                                    <div className="w-2 h-2 rounded-full bg-zinc-300" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                <span className="font-medium">{commonData.public}</span>
                                            </div>
                                            <span className="text-xs text-zinc-500">{commonData.publicDescription}</span>
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => setVisibility(0)}
                                        className={`flex items-start gap-3 py-3 px-3 text-sm rounded-lg cursor-pointer ${visibility === 0
                                            ? 'bg-zinc-800 text-zinc-100'
                                            : 'text-zinc-300 hover:bg-zinc-800/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center w-5 h-5">
                                            <div className={`w-4 h-4 rounded-full border-2 ${visibility === 0
                                                ? 'border-zinc-300'
                                                : 'border-zinc-600'
                                                } flex items-center justify-center`}>
                                                {visibility === 0 && (
                                                    <div className="w-2 h-2 rounded-full bg-zinc-300" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <Lock className="h-4 w-4" />
                                                <span className="font-medium">{commonData.private}</span>
                                            </div>
                                            <span className="text-xs text-zinc-500">{commonData.privateDescription}</span>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                id="chatinput-send-message-button"
                                type="submit"
                                variant="ghost"
                                disabled={!will.trim()}
                                className="h-8 px-2 flex items-center text-zinc-300 hover:text-zinc-100"
                            >
                                <CircleChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>


                    {!readonly && (
                        <div className="relative flex max-w-full gap-1 mx-2 mt-5 md:mt-8">
                            <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
                                <div className="flex gap-2.5 sm:justify-center">
                                    {pageWillData.samples.suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-zinc-800 px-3 py-1.5 transition-colors hover:bg-zinc-800/20"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <p className="text-xs text-zinc-50">{suggestion.key}</p>
                                            <ChevronUp className="h-4 w-4 text-zinc-400" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
