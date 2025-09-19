'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UpvoteIcon, UpvoteIconHandle } from '@/components/ui/upvote-icon';
import { DownvoteIcon, DownvoteIconHandle } from '@/components/ui/downvote-icon';
import { cn } from '@/lib/utils';

interface ConsentButtonProps {
  value: boolean;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function ConsentButton({ 
  value, 
  selected, 
  onClick,
  className 
}: ConsentButtonProps) {
  const iconRef = useRef<UpvoteIconHandle | DownvoteIconHandle>(null);
  
  const handleMouseEnter = () => {
    iconRef.current?.startAnimation();
  };
  
  const handleMouseLeave = () => {
    if (!selected) {
      iconRef.current?.stopAnimation();
    }
  };

  // Base style for both buttons
  const baseStyle = "flex items-center justify-center gap-2 py-3 px-5 rounded-lg font-medium text-base transition-all duration-300";
  
  // Styles for consent button (upvote)
  const consentStyle = cn(
    baseStyle,
    "border",
    selected && value 
      ? "bg-[#00c2cb] text-white border-[#00c2cb] ring-2 ring-[#00c2cb]/30 ring-offset-2" 
      : "bg-white text-[#00c2cb] border-[#00c2cb] hover:bg-[#00c2cb]/10",
    className
  );
  
  // Styles for non-consent button (downvote)
  const nonConsentStyle = cn(
    baseStyle,
    "border",
    selected && !value
      ? "bg-gray-700 text-white border-gray-700 ring-2 ring-gray-400 ring-offset-2"
      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100",
    className
  );

  React.useEffect(() => {
    if (selected) {
      iconRef.current?.startAnimation();
    } else {
      iconRef.current?.stopAnimation();
    }
  }, [selected]);

  if (value) {
    return (
      <Button 
        type="button"
        className={consentStyle}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UpvoteIcon 
          ref={iconRef as React.RefObject<UpvoteIconHandle>}
          size={24}
          className={selected ? "text-white" : "text-[#00c2cb]"}
        />
        <span>I Consent</span>
      </Button>
    );
  }
  
  return (
    <Button 
      type="button" 
      variant="outline"
      className={nonConsentStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DownvoteIcon 
        ref={iconRef as React.RefObject<DownvoteIconHandle>}
        size={24}
        className={selected ? "text-white" : "text-gray-700"}
      />
      <span>I Do Not Consent</span>
    </Button>
  );
}