import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useFeaturedDaoDivinations} from "@/services/api";
import {Loader2} from "lucide-react";
import {useEffect, useState} from "react";

export const FeaturedDaoDivinations = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Fetch latest public divinations
    const {
        data: latestPublicDivinations = [],
        isLoading,
        isError,
        error
    } = useFeaturedDaoDivinations();

    // Add fade-in effect when component mounts
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`rounded-xl border border-gray-800 backdrop-blur-sm bg-black/20 p-4 mt-4 transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-gray-800">
                        <TableHead className="text-center text-gray-300">Title</TableHead>
                        <TableHead className="text-center text-gray-300">Date</TableHead>
                        <TableHead className="text-center text-gray-300">Type</TableHead>
                        <TableHead className="text-center text-gray-300">Status</TableHead>
                        <TableHead className="text-center text-gray-300">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                                <div className="flex justify-center items-center">
                                    <Loader2 className="h-6 w-6 text-gray-400 animate-spin mr-2" />
                                    <span className="text-white/70">Loading...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-red-400 py-4">
                                Error loading divinations
                            </TableCell>
                        </TableRow>
                    ) : latestPublicDivinations.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-white/70 py-4">No divinations found</TableCell>
                        </TableRow>
                    ) : (
                        latestPublicDivinations.map((divination, index) => (
                            <TableRow
                                // key={divination.id}
                                key={index}
                                className="border-b border-gray-800/50 hover:bg-gray-800/30"
                            >
                                <TableCell className="text-white">{divination.will.substring(0, 30)}...</TableCell>
                                <TableCell className="text-white/70">{new Date(divination.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-white/70">{divination.visibility === 1 ? "Public" : "Private"}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${divination.known_status === "known"
                                        ? "bg-green-500/20 text-green-300"
                                        : "bg-blue-500/20 text-blue-300"
                                        }`}>
                                        {divination.known_status === "known" ? "Completed" : "In Progress"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default FeaturedDaoDivinations; 