import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = 'h-20 w-20' }) => (
  <img
    src="https://lh5.googleusercontent.com/proxy/FCjNbLjwxQxLDxCguteFY2kakCyku43Ilm2BAbLlN4Yc939CG1wdXAK2X8hMwzihiPq2-j-dK_A00CwPYf_Yn6ZHjDZfeKRkhMM2GG0"
    alt="Logo UNSTA"
    className={className}
  />
);

export default Logo;