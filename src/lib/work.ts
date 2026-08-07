export type WorkItem = {
  title: string;
  /** Produced by scripts/prepare-work-images.mjs — cropped to the 186:277 card. */
  image?: string;
};

export const workItems: WorkItem[] = [
  { title: "Original IP", image: "/images/work/original-ip.jpg" },
  { title: "Anime Micro Drama", image: "/images/work/anime-micro-drama.jpg" },
  { title: "Live Action Fantasy", image: "/images/work/live-action-fantasy.jpg" },
  {
    title: "Animation Music Video",
    image: "/images/work/animation-music-video.jpg",
  },
];
