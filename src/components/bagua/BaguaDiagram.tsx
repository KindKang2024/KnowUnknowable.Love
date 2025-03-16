import React from 'react';

interface BaguaDiagramProps {
  onSectionClick: (id: string) => void;
}

export function BaguaDiagram({ onSectionClick }: BaguaDiagramProps) {
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    const section = target.closest('g[id^="named_"]');
    if (section) {
      const id = section.id.replace('named_', '');
      onSectionClick(id);
    }
  };

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 547.41479 547.41479"
        className="w-full h-auto transition-all duration-300"
        onClick={handleClick}
      >
        <title id="bagua-duki">BaguaDukiContract</title>
        {/* SVG content */}
        {/* Note: Full SVG content is preserved but omitted here for brevity */}
      </svg>
    </div>
  );
}