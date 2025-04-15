import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://scores.iplt20.com/ipl/teamlogos/GT.png?v=1'),
      new URL('https://scores.iplt20.com/ipl/teamlogos/DC.png'),
      new URL('https://feeds-100mb.s3-ap-southeast-1.amazonaws.com/teamLogos/NVAlbtIyB81740555172aFPMviEPyJ1710927747rcb.png'),
      new URL('https://feeds-100mb.s3-ap-southeast-1.amazonaws.com/teamLogos/gPLvfvSC1X1711457972LSG.png'),
      new URL('https://scores.iplt20.com/ipl/teamlogos/KKR.png'),
      new URL('https://scores.iplt20.com/ipl/teamlogos/PBKS.png'),
      new URL('https://scores.iplt20.com/ipl/teamlogos/MI.png'),
      new URL('https://feeds-100mb.s3-ap-southeast-1.amazonaws.com/teamLogos/sSNjJEkBAx1742900310RR---New-Logo.png'),
      new URL('https://scores.iplt20.com/ipl/teamlogos/SRH.png'),
      new URL('https://scores.iplt20.com/ipl/teamlogos/CSK.png'),
      new URL('https://scores.iplt20.com/ipl/teamlogos/**'),
      
    ],
  },
};

export default withFlowbiteReact(nextConfig);