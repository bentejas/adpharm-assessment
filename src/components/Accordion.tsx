import React, { useState, useRef, useEffect } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : '0px';
    }
  }, [isOpen]);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-2 bg-indigo-100 rounded-lg shadow-md focus:outline-none transition-all duration-300">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-indigo-700">{title}</span>
          <span>{isOpen ? '-' : '+'}</span>
        </div>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-max-height duration-300 ease-in-out"
        style={{ maxHeight: '0px' }}>
        <div className="p-4 bg-indigo-50 rounded-b-lg">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
