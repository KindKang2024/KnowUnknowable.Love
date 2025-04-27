import React from 'react';

interface IconProps {
  className?: string;
  width?: number;
  height?: number;
  fill?: string;
}

export const HomeIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const MediumIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10z" />
  </svg>
);

export const DivineIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M22 2 2 22" />

    {/* Top dot */}
    <circle cx="9" cy="9" r="1" fill="currentColor" />
    {/* Bottom dots */}
    <circle cx="12" cy="18" r="1" fill="currentColor" />
    <circle cx="17" cy="13" r="1" fill="currentColor" />

  </svg>
);

export const GrokDivineIcon: React.FC<IconProps> = ({ className = "h-6 w-6 scale-150" }) => (
  <svg viewBox="0 0 42 42" aria-hidden="true" className={className}>
    <g>
      <path d="M27.997 17.35l-11.1 8.19 15.9-15.963v.015L37.391 5c-.082.117-.165.23-.248.345-3.49 4.804-5.194 7.153-3.826 13.03l-.009-.008c.943 4.001-.065 8.438-3.322 11.693-4.106 4.107-10.677 5.02-16.087 1.324l3.772-1.745c3.454 1.355 7.232.76 9.947-1.954 2.716-2.714 3.325-6.666 1.96-9.956-.259-.623-1.037-.78-1.58-.378z m-13.292-2.574c-3.314 3.31-3.983 9.047-.1 12.755l-.003.003L4 37c.663-.913 1.485-1.776 2.306-2.639l.04-.042c2.346-2.464 4.67-4.906 3.25-8.357-1.903-4.622-.795-10.038 2.73-13.56 3.664-3.66 9.06-4.583 13.568-2.729.998.37 1.867.897 2.545 1.387l-3.764 1.737c-3.505-1.47-7.52-.47-9.97 1.98z" fill="white" opacity={0.8}></path>
      <circle cx="18.75" cy="18.75" r="1.75" fill="yellow" opacity={0.8}></circle>
      <circle cx="22" cy="26" r="1.75" fill="white" opacity={0.8}></circle>
      <circle cx="26" cy="22" r="1.75" fill="white" opacity={0.8}></circle>
    </g>
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

// use an yingyang icon

export const YinYangIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`bi bi-yin-yang ${className} rotate-180`} viewBox="0 0 16 16">
    <path d="M9.167 4.5a1.167 1.167 0 1 1-2.334 0 1.167 1.167 0 0 1 2.334 0" />
    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 0 1 7-7 3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 0 0 7 7 7 0 0 1-7-7m7 4.667a1.167 1.167 0 1 1 0-2.334 1.167 1.167 0 0 1 0 2.334" />
  </svg>
);

export const TwitterXIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="white">
    <g>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </g>
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const GithubIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const TwitterIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export const LinkedinIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const ScrollIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#FFEEDA" d="M21.702 15.822V2.532C21.684 1.422 20.82.527 19.734.527H6.197C3.277.57.93 3.02.93 6.022c0 1.013.264 1.88.67 2.64.345.633.883 1.23 1.412 1.672.15.127.08.072.539.362a5.8 5.8 0 0 0 1.359.597l-.01 7.946c.018.38.054.741.15 1.075.3 1.122 1.06 1.98 2.092 2.396.433.172.918.29 1.439.299l10.81.036c2.153 0 3.9-1.79 3.9-4.005a4.02 4.02 0 0 0-1.588-3.218"></path><path fill="#EBC28E" d="M21.966 19.14c-.044 1.419-1.182 2.558-2.577 2.558l-7.439-.027a4.06 4.06 0 0 0 .953-2.613c0-1.564-.909-2.64-.909-2.64h7.404c1.421 0 2.577 1.185 2.577 2.64z"></path><path fill="#101010" d="M3.717 9.213c-.856-.832-1.456-1.907-1.456-3.182v-.136C2.331 3.717 4.08 1.963 6.206 1.9h13.537c.353.019.635.272.635.642v11.734c.31.055.46.1.76.208.238.09.564.28.564.28V2.542C21.684 1.43 20.82.534 19.734.534H6.197C3.277.58.93 3.03.93 6.031c0 1.745.776 3.236 2.047 4.285.088.072.168.163.397.163.397 0 .68-.326.662-.678-.009-.299-.132-.407-.318-.588"></path><path fill="#101010" d="M19.39 15.044H8.774a1.314 1.314 0 0 0-1.289 1.329v1.564c.018.723.618 1.338 1.333 1.338h.785v-1.338h-.785v-1.528h.432c1.342 0 2.33 1.275 2.33 2.64 0 1.211-1.077 2.757-2.877 2.63-1.597-.108-2.462-1.563-2.462-2.63V5.796c0-.597-.477-1.085-1.059-1.085H4.123v1.356h.785v12.99c-.044 2.64 1.836 3.97 3.795 3.97l10.696.036c2.153 0 3.9-1.79 3.9-4.005s-1.756-4.014-3.91-4.014m2.577 4.095c-.044 1.42-1.183 2.559-2.577 2.559l-7.44-.027a4.06 4.06 0 0 0 .954-2.613c0-1.564-.91-2.64-.91-2.64H19.4c1.42 0 2.576 1.184 2.576 2.64zM16.53 6.311H8.526V4.955h8.004a.67.67 0 0 1 .662.678.67.67 0 0 1-.662.678"></path><path fill="#101010" d="M16.53 12.693H8.526v-1.356h8.004a.67.67 0 0 1 .662.678.67.67 0 0 1-.662.678M17.942 9.502H8.526V8.146h9.407a.67.67 0 0 1 .662.678.66.66 0 0 1-.653.678"></path></svg>
);

export const JudgeGavelIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 20 20">
    <path fill="currentColor" d="M6.44 5.283a1.5 1.5 0 0 0 .225 2.307l1.766 1.183l-5.853 5.853a1.976 1.976 0 1 0 2.795 2.795l5.853-5.853l1.183 1.767a1.5 1.5 0 0 0 2.307.225l2.84-2.84a1.5 1.5 0 0 0-.183-2.279l-3.315-2.387a.5.5 0 0 1-.113-.114l-2.387-3.315a1.5 1.5 0 0 0-2.278-.184L6.44 5.283Zm4.219 5.438l-5.993 5.993a.977.977 0 0 1-1.38-1.381L9.277 9.34l.745.5a.5.5 0 0 1 .137.137l.499.744ZM7.222 6.76a.5.5 0 0 1-.075-.77l2.84-2.84a.5.5 0 0 1 .76.06l.568.79L8.02 7.293l-.798-.534Zm1.644 1.1l3.04-3.04l1.228 1.704a1.5 1.5 0 0 0 .34.34l1.705 1.228l-3.04 3.04L10.99 9.42a1.5 1.5 0 0 0-.41-.411L8.865 7.86Zm7.135.824l.787.568a.5.5 0 0 1 .061.759l-2.84 2.841a.5.5 0 0 1-.77-.075l-.533-.798L16 8.685ZM12 16.5a.5.5 0 0 1 .5-.5h3a.5.5 0 1 1 0 1h2a.5.5 0 1 1 0 1h-7a.5.5 0 1 1 0-1h2a.5.5 0 0 1-.5-.5Z" />
  </svg>
);


export const BaseIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg width="111" height="111" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0052FF" />
  </svg>
);

export const DiviSearchIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    //  className="lucide lucide-search-slash-icon lucide-search-slash"
    className={className}
    version="1.1"
    id="svg2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m13.5 8.5-5 5"
      id="path1" />
    <circle
      cx="11"
      cy="11"
      r="8"
      id="circle1" />
    <path
      d="m21 21-4.3-4.3"
      id="path2" />
    <path
      id="dot_2"
      d="M 6.5084747,8.4406779 6.4208321,8.9680873 5.8921529,9.0477127 5.6530539,8.5695145 6.0339617,8.1943464 Z"
      transform="matrix(0.56946783,0,0,0.56946783,5.2570027,3.4030385)"
    />
    <path
      id="dot_1"
      d="M 6.5084747,8.4406779 6.4208321,8.9680873 5.8921529,9.0477127 5.6530539,8.5695145 6.0339617,8.1943464 Z"
      transform="matrix(0.56946783,0,0,0.56946783,8.350223,9.9781564)"
    />
    <path
      id="dot_3"
      d="M 6.5084747,8.4406779 6.4208321,8.9680873 5.8921529,9.0477127 5.6530539,8.5695145 6.0339617,8.1943464 Z"
      transform="matrix(0.56946783,0,0,0.56946783,11.850223,6.9030385)"
    />
  </svg>

);



interface SocialLinkProps {
  icon: React.FC<{ className?: string }>;
  href: string;
  label: string;
}

export const SocialLink: React.FC<SocialLinkProps> = ({ icon: Icon, href, label }) => (
  <a
    href={href}
    className="hover:text-blue-400 transition-colors"
    aria-label={label}
  >
    <Icon className="h-5 w-5" />
  </a>
);

export const IChingIcon: React.FC<IconProps> = ({ className = "h-3 w-3", width = 18, height = 22, fill = '#f5f5f5' }) => {
  const viewBoxWidth = 89;
  const viewBoxHeight = 200;

  // Determine width and height, maintaining aspect ratio if only one is provided
  let svgWidth: number;
  let svgHeight: number;
  if (width && height) {
    svgWidth = width;
    svgHeight = height;
  } else if (width) {
    svgWidth = width;
    svgHeight = width * (viewBoxHeight / viewBoxWidth);
  } else if (height) {
    svgHeight = height;
    svgWidth = height * (viewBoxWidth / viewBoxHeight);
  } else {
    // Default size: width = 40px, height calculated accordingly
    svgWidth = 40;
    svgHeight = 40 * (viewBoxHeight / viewBoxWidth); // ≈ 89.89px
  }

  return (
    <svg viewBox="0 0 89 200" style={{ width: svgWidth, height: svgHeight }} className={className}>
      <path
        d="M 38.62642,0.50927058 C 13.66512,4.4383596 -6.5680699,31.79403 14.66652,53.03013 C 20.64122,59.00523 40.93602,62.72853 39.39342,72.07023 C 37.01812,86.45463 17.22892,81.54523 7.6264201,83.29863 C 2.6984101,84.19853 -1.6331399,88.82243 0.37333409,94.02703 C 5.1022401,106.29323 24.38952,97.28343 31.62642,93.05863 C 32.78952,92.37963 40.92172,86.47733 41.80932,88.09263 C 43.18462,90.59553 38.01422,95.58583 36.58322,97.03013 C 29.57642,104.10223 21.11872,105.68323 12.64572,109.98623 C 10.18492,111.23523 7.0566901,113.66923 8.7128401,116.79523 C 10.84492,120.82023 17.89382,120.31923 21.62642,119.76923 C 33.85352,117.96823 43.31382,108.37823 51.62642,100.07023 C 53.64472,98.05303 60.61172,89.01933 63.81002,93.44673 C 67.04452,97.92423 58.22832,105.86223 55.45662,108.49123 C 44.30612,119.06423 30.35102,124.97323 16.62722,131.37923 C 12.73672,133.19623 6.7617801,136.69223 9.6696201,141.92223 C 12.38622,146.80723 21.21682,145.24123 25.62642,144.17023 C 40.20312,140.63023 52.69842,129.00723 62.34092,118.07023 C 63.92542,116.27323 71.89562,104.85823 74.46202,106.27723 C 80.97342,109.87623 68.97302,125.46623 66.53302,128.05523 C 50.49532,145.07423 25.32632,149.31723 11.98602,169.07023 C 7.5753301,175.60123 -4.0879399,198.85323 11.62642,199.94223 C 22.43692,200.69123 21.32042,178.80023 27.72052,172.10923 C 47.12182,151.82823 94.74812,139.78923 88.29772,103.07023 C 86.44112,92.50133 76.92552,84.10503 67.62642,79.86263 C 61.51812,77.07603 51.40602,78.12093 51.21822,69.12893 C 51.12442,64.63663 56.36032,64.77763 59.62642,63.91433 C 68.41112,61.59233 76.52482,57.32073 82.23602,50.06943 C 105.30142,20.78433 65.27782,-3.6858404 38.62642,0.50927058 M 40.62642,10.37043 C 52.34042,8.6824396 66.54062,11.42003 74.23292,21.08493 C 86.80372,36.87923 69.26662,52.72423 53.62642,54.78083 C 42.03822,56.30463 28.91852,54.13393 20.84012,45.03013 C 6.8325201,29.24433 24.46082,12.69983 40.62642,10.37043 M 62.49292,25.02163 C 57.96082,25.12373 53.37662,27.50473 48.62642,27.61503 C 43.46362,27.73483 35.59512,25.13883 30.94432,28.24923 C 27.35462,30.65003 28.89132,35.88723 31.85482,38.06173 C 36.50662,41.47493 44.14362,41.29663 49.62642,41.03013 C 54.71952,40.78253 60.55802,39.12053 63.77152,34.88193 C 65.64572,32.40983 67.88782,24.90003 62.49292,25.02163 z"
        style={{ fill, stroke: 'none' }}
      />
    </svg>
  );
};

export default IChingIcon;

