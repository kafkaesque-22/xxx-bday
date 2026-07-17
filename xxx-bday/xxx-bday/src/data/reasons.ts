import { ReasonItem } from "../types";

export interface CuratedReason {
  id: number;
  ordinal: string;
  text: string;
  image: string;
  bgColor: string;
  emoji: string;
  bgColorOverride?: string;
  overrideColor?: string;
}

export const CURATED_REASONS: CuratedReason[] = [
  {
    id: 1,
    ordinal: "1st",
    text: "Your gorgeous smile has a radiant warmth!",
    image: "assets/reasons/ZawaRahman_20230104_04.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#82e0bc", // Vibrant sage green
    emoji: ""
  },
  {
    id: 2,
    ordinal: "2nd",
    text: "You are a very kind soul!",
    image: "assets/reasons/ZawaRahman_20230802_08.jpg?auto=format&fit=crop&q=80&w=800", // Meditation (matches Group 5!)
    bgColor: "#e0ac70", // Vibrant warm caramel/peach
    emoji: "",
    overrideColor: "#C7C9CB"
  },
  {
    id: 3,
    ordinal: "3rd",
    text: "You look too darn cute!",
    image: "assets/reasons/ZawaRahman_20230820_02.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#fcc47c", // Vibrant warm sand/cream
    emoji: "",
    overrideColor: "#A05E6B"
  },
  {
    id: 4,
    ordinal: "4th",
    text: "You have an incredible work ethic!",
    image: "assets/reasons/ZawaRahman_20230827_05.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#b892e6", // Vibrant lavender
    emoji: "",
    overrideColor: "#FFCBD5"
  },
  {
    id: 5,
    ordinal: "5th",
    text: "You have endless determination!",
    image: "assets/reasons/ZawaRahman_20230829_02.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#235c61", // Vibrant dusty blue
    emoji: "",
    overrideColor: "#307481"
  },
  {
    id: 6,
    ordinal: "6th",
    text: "You have incredibly soft hands! (What lotion do you use?)",
    image: "assets/reasons/ZawaRahman_20231127_04.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#ff9c85", // Vibrant peach/terracotta
    emoji: ""
  },
  {
    id: 7,
    ordinal: "7th",
    text: "Your amazing patience can make even a monk jealous!",
    image: "assets/reasons/ZawaRahman_20231215_01.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#fcdb60", // Vibrant warm gold
    emoji: ""
  },
  {
    id: 8,
    ordinal: "8th",
    text: "You put the needs of your loved ones above yours!",
    image: "assets/reasons/ZawaRahman_20231219_07.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#ff9ebc", // Vibrant rose
    emoji: ""
  },
  {
    id: 9,
    ordinal: "9th",
    text: "You carry yourself with effortless grace!",
    image: "assets/reasons/ZawaRahman_20220418_22.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#ff8b73", // Vibrant coral sand
    emoji: ""
  },
  {
    id: 10,
    ordinal: "10th",
    text: "You have a very soothing voice!",
    image: "assets/reasons/ZawaRahman_20220506_08.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#b9e35b", // Vibrant olive/lime
    emoji: ""
  },
  {
    id: 11,
    ordinal: "11th",
    text: "You remember the little details about people that everyone else forgets!",
    image: "assets/reasons/ZawaRahman_20220514_10.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#56d4d6", // Vibrant teal
    emoji: "",
    overrideColor: "#DC412B"
  },
  {
    id: 12,
    ordinal: "12th",
    text: "You have a great sense of style (except those leather pants)!",
    image: "assets/reasons/ZawaRahman_20221115_01.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#8ca5eb", // Vibrant steel blue
    emoji: ""
  },
  {
    id: 13,
    ordinal: "13th",
    text: "You're an extraordinary hair expert!",
    image: "assets/reasons/ZawaRahman_20221123_01.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#ff8da0", // Vibrant blush pink
    emoji: ""
  },
  {
    id: 14,
    ordinal: "14th",
    text: "You give the absolute best hugs!",
    image: "assets/reasons/ZawaRahman_20221217_04.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#6fc2e6", // Vibrant sky blue
    emoji: ""
  },
  {
    id: 15,
    ordinal: "15th",
    text: "You smell incredible!",
    image: "assets/reasons/ZawaRahman_20210301_10.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#6fe082", // Vibrant mint leaf
    emoji: "",
    overrideColor: "#EDC440"
  },
  {
    id: 16,
    ordinal: "16th",
    text: "You have a great taste in music!",
    image: "assets/reasons/ZawaRahman_20210708_12.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#7e91e6", // Vibrant storm blue
    emoji: ""
  },
  {
    id: 17,
    ordinal: "17th",
    text: "You make an effort to grow and learn every day!",
    image: "assets/reasons/ZawaRahman_20211213_18.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#78aef2", // Vibrant cornflower blue
    emoji: ""
  },
  {
    id: 18,
    ordinal: "18th",
    text: "You are one of the bravest people I know!",
    image: "assets/reasons/ZawaRahman_20200107_02.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#e6c38e", // Vibrant amber parchment
    emoji: ""
  },
  {
    id: 19,
    ordinal: "19th",
    text: "You are a great listener!",
    image: "assets/reasons/ZawaRahman_20200203_08.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#f299c5", // Vibrant raspberry rose
    emoji: ""
  },
  {
    id: 20,
    ordinal: "20th",
    text: "You can make others feel safe!",
    image: "assets/reasons/ZawaRahman_20200216_10.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#fc9d49", // Vibrant tangerine
    emoji: "",
    overrideColor:"#ABD7E4"
  },
  {
    id: 21,
    ordinal: "21st",
    text: "Your handwriting is gorgeous!",
    image: "assets/reasons/ZawaRahman_20200415_12.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#ffd07d", // Vibrant honey
    emoji: "",
    overrideColor: "#F75A77"
  },
  {
    id: 22,
    ordinal: "22nd",
    text: "You are very intelligent and have a quick wit!",
    image: "assets/reasons/ZawaRahman_20200418_03.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#55dfdf", // Vibrant seafoam/turquoise
    emoji: ""
  },
  {
    id: 23,
    ordinal: "23rd",
    text: "Your passion for your favorite things is incredibly endearing!",
    image: "assets/reasons/ZawaRahman_20200422_01.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#62e69b", // Vibrant jade green
    emoji: ""
  },
  {
    id: 24,
    ordinal: "24th",
    text: "You hold yourself to such high standards in everything you do!",
    image: "assets/reasons/ZawaRahman_20200525_27.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#f57dbd", // Vibrant fuchsia/magenta
    emoji: ""
  },
  {
    id: 25,
    ordinal: "25th",
    text: "Your determination to eat cold treats is both terrifying and adorable!",
    image: "assets/reasons/ZawaRahman_20200530_043.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#5ebbfa", // Vibrant ocean blue
    emoji: ""
  },
  {
    id: 26,
    ordinal: "26th",
    text: "You have the most beautiful eyes!",
    image: "assets/reasons/ZawaRahman_20201031_05.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#f7db54", // Vibrant sunflower gold
    emoji: ""
  },
  {
    id: 27,
    ordinal: "27th",
    text: "You have a perfectly sharp, cute nose (even if you refuse to believe it)!",
    image: "assets/reasons/ZawaRahman_20190731_06.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#69a7d6", // Vibrant slate twilight
    emoji: ""
  },
  {
    id: 28,
    ordinal: "28th",
    text: "You have a vast oceanic soul!",
    image: "assets/reasons/ZawaRahman_20190731_14.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#ff8f66", // Vibrant terracotta
    emoji: ""
  },
  {
    id: 29,
    ordinal: "29th",
    text: "You make me want to become a better person!",
    image: "assets/reasons/ZawaRahman_20191018_05.jpg?auto=format&fit=crop&q=80&w=800",
    bgColor: "#e6cca3", // Vibrant linen sand
    emoji: ""
  },
  {
    id: 30,
    ordinal: "30th",
    text: "You look so innocent when you are asleep!",
    image: "assets/reasons/ZawaRahman_20210121_01.jpg?auto=format&fit=crop&q=80&w=800", // Flowers (matches Group 6!)
    bgColor: "#ff735c", // Vibrant salmon
    emoji: ""
  }
];
