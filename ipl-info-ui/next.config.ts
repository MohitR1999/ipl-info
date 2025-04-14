import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://scores.iplt20.com/ipl/teamlogos/**')],
  },
};

export default withFlowbiteReact(nextConfig);