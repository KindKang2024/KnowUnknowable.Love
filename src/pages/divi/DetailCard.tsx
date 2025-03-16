import React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {X} from 'lucide-react';
import {useUIStore} from '@/stores/uiStore';

const DetailCard: React.FC = () => {
    const { diviFocusKey, setDiviFocusKey } = useUIStore()
    const mockData = {
        text: 'text',
        title: 'title',
        description: 'description',
        details: 'details',
        moreLink: 'moreLink',
    }

    return (
        <div className="fixed top-4 z-50 w-full px-4 md:px-0 md:right-4 md:top-16 md:w-96 transform transition-all duration-300 ease-in-out">
            <Card className="bg-black/80 border-gray-700 text-white backdrop-blur-md shadow-xl">
                <CardHeader className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 text-gray-400 hover:text-white"
                        onClick={() => setDiviFocusKey('')}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <CardTitle className="text-xl text-cyan-300">{diviFocusKey}</CardTitle>
                    <CardDescription className="text-gray-300">
                        {mockData.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-400">
                        {mockData.details}
                    </p>
                </CardContent>
                {mockData.moreLink && (
                    <CardFooter>
                        <a
                            href={mockData.moreLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-sm ml-auto flex items-center gap-1"
                        >
                            Learn more
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default DetailCard; 