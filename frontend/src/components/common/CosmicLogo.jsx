import React from 'react';

const CosmicLogo = ({ className, color = "currentColor", dashed = true }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
      strokeDasharray={dashed ? "3 3" : ""} 
      opacity={color === "white" ? "0.6" : "1"} 
    />
    <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke={color === "white" ? "currentColor" : "#8B5CF6"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 14L10 12L12 10L14 12L12 14Z" fill={color === "white" ? "currentColor" : "#6D28D9"} />
    <path d="M12 2V6" stroke={color === "white" ? "currentColor" : "#A78BFA"} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 18V22" stroke={color === "white" ? "currentColor" : "#A78BFA"} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M2 12H6" stroke={color === "white" ? "currentColor" : "#A78BFA"} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 12H22" stroke={color === "white" ? "currentColor" : "#A78BFA"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default CosmicLogo;
