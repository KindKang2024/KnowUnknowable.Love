import {Reference} from '@/i18n/data_types';
import React from 'react';

const References: React.FC<{ references: Reference[] }> = ({ references }) => {
    return (
        <div className="mt-8">
            <div className="rounded-lg bg-black/30 p-6">
                <h3 className="text-2xl text-purple-300 mb-8 font-semibold">References</h3>
                <div className="space-y-6">
                    {references.map((ref, index) => (
                        <div key={index} className="grid grid-cols-[auto,1fr] gap-4">
                            <div className="text-purple-300/80 text-sm pt-1">
                                [{index + 1}]
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-start gap-3 flex-wrap">
                                    <a 
                                        href={ref.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-purple-300 transition-colors flex items-center gap-1 font-medium"
                                    >
                                        {ref.title}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                    {(ref.author || ref.authors) && (
                                        <>
                                            <span className="text-white/60">by</span>
                                            <span className="text-purple-300/80 font-medium">
                                                {ref.author || ref.authors}
                                            </span>
                                        </>
                                    )}
                                </div>
                                {ref.description && (
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        {ref.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default References; 