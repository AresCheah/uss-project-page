export type Author = {
  name: string;
  note?: "equal" | "corresponding";
};

export type LinkItem = {
  label: "PDF" | "arXiv" | "Code";
  href: string;
  pending?: boolean;
};

export type Contribution = {
  title: string;
  summary: string;
  keywords: string[];
};

export type TableData = {
  caption: string;
  columns: string[];
  rows: Array<
    | {
        type?: "data";
        label: string;
        values: Array<string | { value: string; emphasis?: "bold" | "red" | "blue" }>;
        highlight?: boolean;
        labelEmphasis?: "bold";
      }
    | {
        type: "group";
        label: string;
      }
  >;
  notes?: string[];
};

export type DemoItem = {
  title: string;
  tag: string;
  description: string;
  poster: string;
  videoSrc?: string;
};

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const pageSections = [
  { id: "motivation", label: "Motivation" },
  { id: "contributions", label: "Contributions" },
  { id: "method", label: "Method" },
  { id: "experiments", label: "Experiments" },
  { id: "bibtex", label: "BibTeX" },
];

const demoItems: DemoItem[] = [
  {
    title: "Similar People: Semantic Prompt Failure",
    tag: "Failure case",
    description: "A language-only instruction points to the right category but fails to disambiguate the intended person in a crowded scene.",
    poster: publicAsset("/assets/posters/demo-01.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-01.mp4"),
  },
  {
    title: "Similar People: Spatial Prompt Success A",
    tag: "Spatial prompt",
    description: "A point or box prompt anchors the exact person and preserves target identity through ego-motion and distractors.",
    poster: publicAsset("/assets/posters/demo-02.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-02.mp4"),
  },
  {
    title: "Similar People: Spatial Prompt Success B",
    tag: "Spatial prompt",
    description: "Another successful similar-people run showing more stable lock-on with explicit spatial target cues.",
    poster: publicAsset("/assets/posters/demo-03.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-03.mp4"),
  },
  {
    title: "Long Route",
    tag: "Long-horizon",
    description: "The tracker follows the target across a longer indoor route with turns and evolving viewpoints.",
    poster: publicAsset("/assets/posters/demo-04.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-04.mp4"),
  },
  {
    title: "Stationary Distractor",
    tag: "Distractor analysis",
    description: "The robot keeps attention on the intended target despite nearby irrelevant but visually salient distractors.",
    poster: publicAsset("/assets/posters/demo-05.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-05.mp4"),
  },
  {
    title: "Pedestrian Distractor",
    tag: "Crowded scene",
    description: "USS maintains target identity when unrelated pedestrians cross the trajectory and compete for attention.",
    poster: publicAsset("/assets/posters/demo-06.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-06.mp4"),
  },
  {
    title: "Narrow Corridor",
    tag: "Robust deployment",
    description: "A constrained hallway scenario demonstrating stable following under limited maneuvering space.",
    poster: publicAsset("/assets/posters/demo-07.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-07.mp4"),
  },
];

export const siteContent = {
  title: "USS: Unified Spatial-Semantic Prompts for Embodied Visual Tracking with Latent Dynamics Learning",
  tagline:
    "A project page for embodied visual tracking that moves beyond text-only target indication and lets robots follow who you describe, point to, box, or mask.",
  shortAbstract:
    "USS unifies text, point, bounding box, and mask prompts in one end-to-end tracker, and combines prompt-aware perception with latent dynamics learning for robust, low-latency embodied following.",
  abstract: [
    "Embodied Visual Tracking (EVT) requires an agent to continuously follow a specified target while actively moving through dynamic environments. However, prevailing EVT paradigms predominantly rely on language-based target indication. While language is expressive and convenient, cluttered scenes often contain multiple objects that satisfy the same semantic description, leading to ambiguous target grounding. We therefore propose a paradigm shift, reframing target indication in EVT from text-only specification to unified spatial-semantic prompting. Based on this paradigm, we introduce Unified Spatial-Semantic Prompts for Embodied Visual Tracking with Latent Dynamics Learning, USS, an end-to-end embodied tracking framework that supports text, point, bounding box, and mask prompts within a unified architecture. USS encodes heterogeneous prompts with modality-specific encoders, fuses prompt tokens with visual features through hybrid attention, and decodes compact prompt-conditioned representations into egocentric waypoints. To further improve temporal robustness, USS incorporates a latent world model that predicts future representations through self-supervised alignment. Real-robot experiments demonstrate that explicit spatial target cues yield higher success rates than text-only prompts, particularly in scenarios involving similar distractors and longer-horizon tracking where maintaining instance-level target identity is critical. In the simulation benchmark, USS also achieves state-of-the-art performance among non-MLLM-based methods and competitive results against recent MLLM-based approaches with faster inference speed. Our findings reveal that spatial-semantic prompting provides a more precise and flexible target indication interface for embodied visual tracking.",
  ],
  institution: "Nanyang Technological University",
  authors: [
    { name: "Yuchen Xie", note: "equal" },
    { name: "Xinyu Zhou", note: "equal" },
    { name: "Kuangji Zuo" },
    { name: "Yanshuo Lu" },
    { name: "Fengrui Huang" },
    { name: "Boyu Ma" },
    { name: "Jianfei Yang", note: "corresponding" },
  ] satisfies Author[],
  links: [
    { label: "PDF", href: publicAsset("/assets/docs/USS_paper_copy.pdf") },
    { label: "arXiv", href: "#", pending: true },
    { label: "Code", href: "#", pending: true },
  ] satisfies LinkItem[],
  logos: [
    {
      name: "NTU",
      label: "Nanyang Technological University",
      src: publicAsset("/assets/logos/ntu-from-a2a.jpeg"),
    },
    {
      name: "MARS Lab",
      label: "MARS Lab",
      src: publicAsset("/assets/logos/marslab-from-a2a.jpeg"),
    },
  ],
  motivation: {
    image: publicAsset("/assets/figures/motivation.png"),
    eyebrow: "Motivation",
    title: "Text is expressive, but it is not always precise enough for embodied tracking.",
    body: [
      "Most embodied visual tracking systems assume the user always specifies a target with language. That is convenient, but cluttered scenes often contain several objects or people that fit the same description.",
      "USS reframes the interface itself: instead of asking the policy to infer the exact instance from semantics alone, it accepts unified spatial-semantic prompts so the robot can lock onto the intended target from the very beginning.",
    ],
    bullets: [
      "Language-only prompts break down when similar distractors satisfy the same description.",
      "Point, box, and mask prompts inject instance-level evidence with minimal extra interaction.",
      "Reducing ambiguity at the start of tracking improves every downstream closed-loop decision.",
    ],
  },
  contributions: [
    {
      title: "A new prompting paradigm",
      summary:
        "USS treats text, point, box, and mask as first-class target specifications, shifting EVT from language-only indication to unified spatial-semantic prompting.",
      keywords: ["Prompt interface", "Instance grounding", "Closed-loop tracking"],
    },
    {
      title: "One unified tracking architecture",
      summary:
        "Modality-specific prompt encoders, hybrid attention fusion, sparse waypoint decoding, and a latent world model work together in one efficient end-to-end framework.",
      keywords: ["Hybrid attention", "Waypoint policy", "Latent dynamics"],
    },
    {
      title: "Strong real-world validation",
      summary:
        "USS reaches state-of-the-art performance among non-MLLM approaches, stays competitive with recent MLLM trackers, and runs fast enough for real-time deployment.",
      keywords: ["Real robot", "EVT-Bench", "Fast inference"],
    },
  ] satisfies Contribution[],
  method: {
    image: publicAsset("/assets/figures/method.png"),
    modules: [
      {
        title: "Input Encoding",
        text: "USS first converts text, bounding box, point, and mask prompts into modality-aware representations, so different target specifications can enter one shared tracking pipeline.",
      },
      {
        title: "Vision-Prompt Alignment",
        text: "Prompt tokens are aligned with dense visual features through hybrid attention, letting the model read relevant evidence, write target-conditioned cues back, and form compact prompt-aware representations.",
      },
      {
        title: "Waypoint Prediction Head",
        text: "A lightweight decoder maps the aligned sparse representations to future egocentric waypoints and visibility signals, enabling responsive closed-loop tracking.",
      },
      {
        title: "Action-Conditioned World Model",
        text: "During training, USS predicts future latent states with an action-conditioned world model, strengthening temporal consistency and motion awareness without extra inference cost.",
      },
    ],
  },
  highlightStats: [
    { value: "86.7%", label: "STT success with box prompts" },
    { value: "83.6%", label: "DT success with box prompts" },
    { value: "72 FPS", label: "Peak non-MLLM inference speed" },
    { value: "90%", label: "Real-world similar-people SR with box prompts" },
  ],
  realWorldTable: {
    caption: "Real-world success rate across four indoor tracking scenes.",
    columns: ["Text", "BBox", "Point", "Mask"],
    rows: [
      { label: "Narrow corridor", values: ["100%", "100%", "100%", "100%"] },
      {
        label: "Ped. distractor",
        values: ["75%", { value: "85%", emphasis: "bold" }, { value: "85%", emphasis: "bold" }, "80%"],
      },
      {
        label: "Long route",
        values: ["70%", { value: "85%", emphasis: "bold" }, "80%", "80%"],
      },
      {
        label: "Similar people",
        values: ["45%", { value: "90%", emphasis: "bold" }, "80%", "70%"],
      },
    ],
  } satisfies TableData,
  benchmarkTable: {
    caption:
      "Performance on EVT-Bench. STT, DT, and AT denote Single-Target, Distracted, and Ambiguity Tracking. Results are reported as SR/TR/CR, where SR and TR are higher, and CR is lower.",
    columns: [
      "STT SR",
      "STT TR",
      "STT CR",
      "DT SR",
      "DT TR",
      "DT CR",
      "AT SR",
      "AT TR",
      "AT CR",
      "FPS",
    ],
    rows: [
      { type: "group", label: "Non-MLLM-based methods" },
      {
        label: "IBVS†",
        values: ["42.9", "56.2", "3.75", "10.6", "28.4", "6.14", "15.2", { value: "39.5", emphasis: "red" }, { value: "4.90", emphasis: "red" }, "6.0"],
      },
      {
        label: "PoliFormer",
        values: ["4.67", "15.5", "40.1", "2.62", "13.2", "44.5", "3.04", "15.4", "41.5", "--"],
      },
      {
        label: "EVT",
        values: ["24.4", "39.1", "42.5", "3.23", "11.2", "47.9", "17.4", "21.1", "45.6", "15.0"],
      },
      {
        label: "EVT‡",
        values: ["32.5", "49.9", "40.5", "15.7", "35.7", "53.3", "18.3", "21.0", "44.9", "--"],
      },
      {
        label: "USS (language)",
        labelEmphasis: "bold",
        values: ["70.8", "72.1", "3.13", "49.8", "54.6", "9.89", { value: "34.2", emphasis: "red" }, "35.8", "28.2", "37.0"],
      },
      {
        label: "USS (point)",
        labelEmphasis: "bold",
        values: ["83.4", "86.8", "3.02", "79.8", "80.2", { value: "2.92", emphasis: "red" }, "--", "--", "--", "68.0"],
      },
      {
        label: "USS (mask)",
        labelEmphasis: "bold",
        values: ["81.3", "80.8", "6.65", "75.8", "76.3", "3.04", "--", "--", "--", { value: "72.0", emphasis: "red" }],
      },
      {
        label: "USS (box)",
        labelEmphasis: "bold",
        values: [
          { value: "86.7", emphasis: "red" },
          { value: "92.2", emphasis: "red" },
          { value: "2.73", emphasis: "red" },
          { value: "83.6", emphasis: "red" },
          { value: "81.5", emphasis: "red" },
          "2.93",
          "--",
          "--",
          "--",
          "65.0",
        ],
      },
      { type: "group", label: "MLLM-based methods" },
      {
        label: "Uni-NaVid",
        values: ["25.7", "39.5", "41.9", "11.3", "27.4", "43.5", "8.26", "28.6", "43.7", "5.0"],
      },
      {
        label: "NavFoM",
        values: ["85.0", { value: "80.5", emphasis: "blue" }, "--", { value: "61.4", emphasis: "blue" }, { value: "68.2", emphasis: "blue" }, "--", "--", "--", "--", "2.0"],
      },
      {
        label: "TrackVLA",
        values: [
          { value: "85.1", emphasis: "blue" },
          "78.6",
          { value: "1.65", emphasis: "blue" },
          "57.6",
          "63.2",
          { value: "5.80", emphasis: "blue" },
          { value: "50.2", emphasis: "blue" },
          { value: "63.7", emphasis: "blue" },
          { value: "17.1", emphasis: "blue" },
          { value: "10.0", emphasis: "blue" },
        ],
      },
    ],
    notes: [
      "Red and blue indicate the best result in each metric within the Non-MLLM-based and MLLM-based groups, respectively.",
      "† uses GroundingDINO. ‡ uses SoM+GPT-4o.",
      "§ FPS is measured on an RTX 4090 unless otherwise specified; EVT is measured on an RTX 3090 and Uni-NaVid on an NVIDIA A100.",
    ],
  } satisfies TableData,
  experimentNarrative: [
    "Real-robot trials show that spatial prompts substantially improve identity preservation when multiple similar people appear, while maintaining robust performance in long routes and narrow corridors.",
    "On EVT-Bench, USS establishes a strong accuracy-efficiency frontier: it is state-of-the-art among non-MLLM methods and remains dramatically faster than recent MLLM-based trackers.",
  ],
  demos: demoItems,
  bibtex: `@article{uss2026,
  title={USS: Unified Spatial-Semantic Prompts for Embodied Visual Tracking with Latent Dynamics Learning},
  author={Yuchen Xie and Xinyu Zhou and Kuangji Zuo and Yanshuo Lu and Fengrui Huang and Boyu Ma and Jianfei Yang},
  journal={Preprint},
  year={2026}
}`,
};

export function getAuthorNote(note?: Author["note"]) {
  if (note === "equal") return "*";
  if (note === "corresponding") return "†";
  return "";
}
