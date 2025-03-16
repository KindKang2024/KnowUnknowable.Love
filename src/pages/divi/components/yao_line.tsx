interface YaoLineProps {
    value: number; // 6, 7, 8, or 9
    index: number;
}

export const YaoLine = ({ value, index }: YaoLineProps) => {
    // Determine if the line is yin (broken) or yang (solid)
    const isYin = value === 6 || value === 8;

    // Colors for different line types
    const yangColor = "#F97B7B"; // Solid line (red color from image)
    const yinColor = "#A9A9A9";  // Broken line (gray color from image)

    // If value is 0, return placeholder state
    if (value === 0) {
        return (
            <div className="flex items-center w-full">
                <div className="flex-1 flex items-center">
                    <div
                        className="h-2 rounded-full flex-1 bg-gray-600 animate-pulse"
                    ></div>
                </div>
            </div>
        );
    }


    return (
        <div className="flex items-center w-full">
            {isYin ? (
                // Yin (broken) line
                <div className="flex-1 flex items-center" key={'yin_boken_line'}>
                    <div
                        className="h-4 bg-current flex-1"
                        style={{
                            backgroundColor: yinColor
                        }}
                    ></div>
                    <div className="w-4"></div> {/* Gap */}
                    <div
                        className="h-4 bg-current flex-1"
                        style={{
                            backgroundColor: yinColor
                        }}
                    ></div>

                </div>
            ) : (
                <div className="flex-1 flex items-center" key={'yang_solid_line'}>
                    {/* Yang (solid) line */}
                    <div
                        className="h-4 bg-current flex-1"
                        style={{
                            backgroundColor: yangColor
                        }}
                    ></div>

                </div>
            )}
        </div>
    );
};
