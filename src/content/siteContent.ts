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

export type HighlightStat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
};

export type ModalityId = "text" | "point" | "box" | "mask";

export type PromptModality = {
  id: ModalityId;
  label: string;
  /** One-line description of how this designation is given. */
  given: string;
  /** How the encoded prompt reaches the policy. */
  route: string;
  strength: string;
};

export type ArchitectureStep = {
  id: string;
  kicker: string;
  title: string;
  body: string;
};

export type SpeedEntry = {
  label: string;
  fps: number;
  note: string;
  family: "uss" | "modular" | "mllm";
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
  title: "USS: Unifying Spatial-Semantic Prompting for End to End Embodied Visual Tracking",
  tagline:
    "A project page for embodied visual tracking in which text, a point, a box, and a mask are complementary ways to designate the target, and the prompt is chosen to fit the scenario.",
  shortAbstract:
    "USS maps text, point, bounding box, and mask prompts directly to egocentric waypoints in one end-to-end architecture, with temporal memory, cross-view fusion, and an auxiliary latent predictor used only during training.",
  abstract: [
    "Embodied Visual Tracking (EVT) requires an agent to continuously follow a designated target while moving through dynamic environments. Existing embodied tracking methods generally rely on either an implicit target-selection convention or a language description, leaving the target-specification interface largely fixed. However, different tracking scenarios naturally favor different forms of target specification: language can specify a target outside the robot's current view, whereas spatial prompts provide direct instance designation for visible targets and can be useful for selecting among similar-looking people, designating hard-to-describe individuals, or specifying a target under time pressure. We therefore introduce unified spatial-semantic prompting for EVT, in which text, a point, a box, and a mask serve as complementary target specifications that can be selected according to different scenarios, and present USS, an end-to-end architecture that maps any of them to egocentric waypoints. A modality-specific prompt encoder feeds a common design comprising hybrid-attention fusion, temporal memory, cross-view aggregation, latent prediction, and waypoint decoding, with one policy instance trained for each interface under an identical recipe. Across 320 zero-shot real-robot trials with policies trained only in simulation, spatial prompts perform comparably to language in ordinary tracking scenarios while providing clear benefits when visually similar targets require precise instance designation, supporting our premise that different scenarios favor different target specifications. On simulation EVT-Bench under the standard language-prompt protocol, USS obtains the highest success rate among non-MLLM methods at 57 FPS, against the 4.8–10 FPS reported by MLLM trackers that are stronger on several metrics.",
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
    { label: "arXiv", href: "http://arxiv.org/abs/2606.25880" },
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
    title: "Different scenarios favor different ways of specifying the target.",
    body: [
      "Embodied visual tracking systems are usually tied to one target-specification interface: an implicit selection convention, or a language description. But the right interface depends on the situation. Language can name a target that is not even in view, while a spatial prompt designates a visible instance directly.",
      "A spatial prompt is useful exactly where a description struggles: telling apart people who look alike, pointing at something hard to describe concisely, or selecting a target under time pressure. Its own requirement is that the target be visible when the prompt is given. USS treats these interfaces as complementary rather than competing, and conditions one end-to-end policy on whichever one fits.",
    ],
    bullets: [
      "Language reaches targets outside the current view; a spatial prompt needs the target to be visible.",
      "A point, box, or mask designates one physical instance directly, without a description that may fit several people.",
      "The prompt is supplied once at initialization, encoded once, and conditions the policy for the rest of the episode.",
    ],
  },
  contributions: [
    {
      title: "Unified spatial-semantic prompting for EVT",
      summary:
        "Target specification is formulated as a scenario-dependent choice among complementary interfaces — language, point, bounding box, and mask — rather than one fixed interface assumed in advance.",
      keywords: ["Prompt interface", "Instance designation", "Closed-loop tracking"],
    },
    {
      title: "One end-to-end architecture for all four prompts",
      summary:
        "Modality-specific prompt encoding, hybrid-attention fusion, temporal memory, cross-view aggregation, and sparse-query waypoint prediction, with an action-conditioned latent predictor used only during training.",
      keywords: ["Hybrid attention", "Waypoint policy", "Latent dynamics"],
    },
    {
      title: "Validation on a physical robot and on EVT-Bench",
      summary:
        "320 zero-shot real-robot trials with simulation-only policies, plus the highest success rate among non-MLLM methods on EVT-Bench under the standard language-prompt protocol, at 57 FPS.",
      keywords: ["Real robot", "EVT-Bench", "Real-time inference"],
    },
  ] satisfies Contribution[],
  method: {
    image: publicAsset("/assets/figures/method.png"),
    modules: [
      {
        title: "Prompt Encoding",
        text: "Text, bounding box, point, and mask prompts are encoded once at initialization by modality-specific encoders, so a single designation conditions the whole episode without being recomputed per frame.",
      },
      {
        title: "Vision-Prompt Fusion with Memory",
        text: "Prompt tokens and learnable queries exchange information with dense visual features in a read-write-read attention pattern, while a sliding memory bank and cross-view aggregation hold the target through ego-motion and brief occlusions.",
      },
      {
        title: "Waypoint Prediction Head",
        text: "A shared transformer decoder turns the sparse prompt-conditioned state into future egocentric waypoints and per-view target-presence logits, so only the first waypoint has to be executed each control step.",
      },
      {
        title: "Action-Conditioned World Model",
        text: "During training, USS predicts the next latent state conditioned on its own predicted waypoints and aligns it with a detached EMA target instead of reconstructing pixels. The predictor is discarded at inference, so it adds no runtime cost.",
      },
    ],
  },
  highlightStats: [
    { value: 86.7, decimals: 1, suffix: "%", label: "STT success rate with box prompts" },
    { value: 83.6, decimals: 1, suffix: "%", label: "DT success rate with box prompts" },
    { value: 57, decimals: 0, suffix: " FPS", label: "Language policy on an RTX 4090" },
    { value: 320, decimals: 0, suffix: "", label: "Zero-shot real-robot trials, simulation-only policies" },
  ] satisfies HighlightStat[],
  realWorldTable: {
    caption:
      "Real-world success rate across four indoor tracking scenes. 20 trials per scene and prompt type, 320 in total, all zero-shot with simulation-trained single-view policies.",
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
    notes: [
      "The prompt types behave similarly except where a distractor shares most of the target's described attributes. In the similar-people scene both candidates wear a black top and only the trousers differ, so the description still identifies the target uniquely and a language failure there is a grounding failure.",
    ],
  } satisfies TableData,
  benchmarkTable: {
    caption:
      "EVT-Bench results. STT, DT, and AT denote Single-Target, Distracted, and Ambiguity Tracking, reported as SR/TR/CR, where SR and TR are higher and CR is lower.",
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
      { type: "group", label: "Modular language-prompt baselines (non-MLLM)" },
      {
        label: "IBVS†",
        values: ["42.9", "56.2", "3.75", "10.6", "28.4", { value: "6.14", emphasis: "red" }, "15.2", { value: "39.5", emphasis: "red" }, { value: "4.90", emphasis: "red" }, "--"],
      },
      {
        label: "PoliFormer†",
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
        values: [
          { value: "70.8", emphasis: "red" },
          { value: "72.1", emphasis: "red" },
          { value: "3.13", emphasis: "red" },
          { value: "49.8", emphasis: "red" },
          { value: "54.6", emphasis: "red" },
          "9.89",
          { value: "34.2", emphasis: "red" },
          "35.8",
          "28.2",
          { value: "57.0", emphasis: "red" },
        ],
      },
      { type: "group", label: "USS spatial-prompt variants (visible-target initialization; separate protocol)" },
      {
        label: "USS (point)",
        labelEmphasis: "bold",
        values: ["83.4", "86.8", "3.02", "79.8", "80.2", { value: "2.92", emphasis: "bold" }, "--", "--", "--", "68.0"],
      },
      {
        label: "USS (mask)",
        labelEmphasis: "bold",
        values: ["81.3", "80.8", "6.65", "75.8", "76.3", "3.04", "--", "--", "--", { value: "72.0", emphasis: "bold" }],
      },
      {
        label: "USS (box)",
        labelEmphasis: "bold",
        values: [
          { value: "86.7", emphasis: "bold" },
          { value: "92.2", emphasis: "bold" },
          { value: "2.73", emphasis: "bold" },
          { value: "83.6", emphasis: "bold" },
          { value: "81.5", emphasis: "bold" },
          "2.93",
          "--",
          "--",
          "--",
          "65.0",
        ],
      },
      { type: "group", label: "MLLM-based language-prompt methods" },
      {
        label: "Uni-NaVid",
        values: ["25.7", "39.5", "41.9", "11.3", "27.4", "43.5", "8.26", "28.6", "43.7", "5.0"],
      },
      {
        label: "NavFoM¶",
        values: ["88.4", "80.7", "--", "62.0", "67.9", "--", "--", "--", "--", "5.1"],
      },
      {
        label: "TrackVLA",
        values: [
          "85.1",
          "78.6",
          "1.65",
          "57.6",
          "63.2",
          "5.80",
          "50.2",
          "63.7",
          "17.1",
          { value: "10.0", emphasis: "blue" },
        ],
      },
      {
        label: "TrackVLA++¶",
        values: [
          { value: "90.9", emphasis: "blue" },
          { value: "82.7", emphasis: "blue" },
          { value: "1.50", emphasis: "blue" },
          { value: "74.0", emphasis: "blue" },
          { value: "73.7", emphasis: "blue" },
          { value: "3.51", emphasis: "blue" },
          { value: "55.9", emphasis: "blue" },
          { value: "63.8", emphasis: "blue" },
          { value: "15.1", emphasis: "blue" },
          "4.8",
        ],
      },
    ],
    notes: [
      "Red and blue mark the best language-prompt result within the non-MLLM and MLLM groups; bold marks the best spatial-prompt result.",
      "Spatial prompts use visible-target initialization with the initial heading perturbed within ±20°, because an instance can only be designated once it is visible. This is a separate protocol, so those rows are not directly comparable with either language-prompt block, including USS's own.",
      "† grounding with GroundingDINO. ‡ with SoM+GPT-4o. ¶ four-view setting.",
      "FPS is measured on an RTX 4090 for USS; baseline throughput is taken as reported (EVT on an RTX 3090, Uni-NaVid on an A100) rather than re-benchmarked, so the gaps reflect deployment cost rather than controlled latency measurements.",
    ],
  } satisfies TableData,
  // The looping clips under the title. Ordered so the similar-people case,
  // which is the one the paper turns on, leads.
  heroReel: [
    {
      tag: "Similar people - spatial prompt",
      title: "A box holds the right person when both wear black",
      poster: publicAsset("/assets/posters/demo-02.jpg"),
      videoSrc: publicAsset("/assets/videos/demo-02.mp4"),
    },
    {
      tag: "Pedestrian distractor",
      title: "Target identity held while others cross the path",
      poster: publicAsset("/assets/posters/demo-06.jpg"),
      videoSrc: publicAsset("/assets/videos/demo-06.mp4"),
    },
    {
      tag: "Narrow corridor",
      title: "Following through a constrained hallway",
      poster: publicAsset("/assets/posters/demo-07.jpg"),
      videoSrc: publicAsset("/assets/videos/demo-07.mp4"),
    },
  ],
  promptModalities: [
    {
      id: "text",
      label: "Text",
      given: "A natural-language description of the target.",
      route: "Encoded by a frozen PE-Core text encoder into prompt tokens.",
      strength: "The only interface that can name a target the robot cannot currently see.",
    },
    {
      id: "point",
      label: "Point",
      given: "A single click on the target in the first frame.",
      route: "RoIAlign over a fixed-size pseudo box, pooled into 4 prompt tokens.",
      strength: "The fastest designation to give, and enough to fix one instance.",
    },
    {
      id: "box",
      label: "Box",
      given: "A bounding box drawn around the target in the first frame.",
      route: "RoIAlign over the box region, pooled into 9 prompt tokens.",
      strength: "Strongest on both EVT-Bench splits and in the similar-people scene.",
    },
    {
      id: "mask",
      label: "Mask",
      given: "A segmentation mask of the target in the first frame.",
      route: "Added to the first-frame visual tokens and held in memory as a dense anchor.",
      strength: "The densest designation, though it never passes through prompt-token fusion.",
    },
  ] satisfies PromptModality[],
  // The four parts of the method figure in the paper, in order.
  architectureSteps: [
    {
      id: "input",
      kicker: "a",
      title: "Input encoding",
      body: "One designation is given at t = 1 and encoded once into prompt tokens. The RGB stream keeps arriving and is encoded every step, with a 16-frame memory carrying the target through ego-motion.",
    },
    {
      id: "align",
      kicker: "b",
      title: "Vision-prompt alignment",
      body: "Prompt tokens and learnable queries attend to each other, then exchange information with the visual tokens in both directions. What leaves the block is a small set of sparse, prompt-conditioned representations.",
    },
    {
      id: "head",
      kicker: "c",
      title: "Waypoint prediction head",
      body: "A shared transformer decoder turns those representations into future egocentric waypoints and a per-view visibility logit. Only the first waypoint is executed each control step.",
    },
    {
      id: "world",
      kicker: "d",
      title: "Action-conditioned world model",
      body: "In training only, the policy predicts its own next latent state from the waypoints it just produced and aligns it with a detached EMA target. The whole branch is removed at inference.",
    },
  ] satisfies ArchitectureStep[],
  speedComparison: [
    { label: "USS (language)", fps: 57.0, note: "RTX 4090, measured", family: "uss" },
    { label: "EVT", fps: 15.0, note: "RTX 3090, reported", family: "modular" },
    { label: "TrackVLA", fps: 10.0, note: "RTX 4090, reported", family: "mllm" },
    { label: "NavFoM", fps: 5.1, note: "RTX 4090, reported", family: "mllm" },
    { label: "Uni-NaVid", fps: 5.0, note: "A100, reported", family: "mllm" },
    { label: "TrackVLA++", fps: 4.8, note: "RTX 4090, reported", family: "mllm" },
  ] satisfies SpeedEntry[],
  experimentNarrative: [
    "Across 320 zero-shot real-robot trials, the four prompt types behave similarly in ordinary tracking scenarios and separate in the single scene where a distractor shares most of the target's described attributes: the box prompt succeeds in 18 of 20 trials there against 9 of 20 for language.",
    "On EVT-Bench under the standard language-prompt protocol, USS obtains the highest success rate among non-MLLM methods on all three splits while running at 57 FPS, below the MLLM trackers in success rate and several times above their reported throughput.",
  ],
  demos: demoItems,
  bibtex: `@article{xie2026ussunifyingspatialsemanticprompting,
  title={USS: Unifying Spatial-Semantic Prompting for End to End Embodied Visual Tracking},
  author={Yuchen Xie and Xinyu Zhou and Kuangji Zuo and Yanshuo Lu and Fengrui Huang and Boyu Ma and Jianfei Yang},
  journal={arXiv preprint arXiv:2606.25880},
  year={2026}
}`,
};

export function getAuthorNote(note?: Author["note"]) {
  if (note === "equal") return "*";
  if (note === "corresponding") return "†";
  return "";
}
