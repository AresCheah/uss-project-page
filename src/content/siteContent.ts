export type Author = {
  name: string;
  note?: "equal" | "corresponding";
  href?: string;
};

export type Cell = string | { value: string; emphasis?: "bold" | "best-a" | "best-b" };

export type TableData = {
  caption: string;
  columns: string[];
  rows: Array<
    | {
        type?: "data";
        label: string;
        values: Cell[];
        highlight?: boolean;
      }
    | {
        type: "group";
        label: string;
      }
  >;
  notes?: string[];
};

export type ModalityId = "text" | "point" | "box" | "mask";

export type PromptModality = {
  id: ModalityId;
  label: string;
  /** How the person gives this designation. */
  given: string;
  /** What the prompt encoder turns it into. */
  encoded: string;
  /** Short label for the token count / route, shown on chips. */
  short: string;
  /** The encoder equation from the paper, in plain text. */
  equation: string;
  image: string;
};

export type MethodStep = {
  id: "prompt" | "vision" | "fusion" | "head" | "world";
  /** Which part of the paper's Figure 2 this step covers. */
  part: string;
  kicker: string;
  title: string;
  body: string[];
  /** Equation or pseudo-code lines, rendered in a mono block. */
  lines?: string[];
  linesTag?: string;
  fine?: string;
  trainingOnly?: boolean;
};

export type SpeedEntry = {
  label: string;
  fps: number;
  note: string;
  family: "uss" | "modular" | "mllm";
};

export type AblationRow = {
  label: string;
  change: string;
  sr: number;
  tr: number;
  cr: number;
  isDefault?: boolean;
};

export type DemoItem = {
  title: string;
  tag: string;
  description: string;
  poster: string;
  videoSrc: string;
};

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const pageSections = [
  { id: "overview", label: "Overview" },
  { id: "method", label: "Method" },
  { id: "results", label: "Results" },
  { id: "real-robot", label: "Real robot" },
  { id: "cite", label: "Cite" },
];

const demoItems: DemoItem[] = [
  {
    title: "Language fails between two people in black",
    tag: "Similar people · text",
    description:
      "The description is correct, yet the language policy does not hold the intended person against the look-alike.",
    poster: publicAsset("/assets/posters/demo-01.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-01.mp4"),
  },
  {
    title: "A box holds the right person",
    tag: "Similar people · box",
    description: "A box placed once at the start keeps the intended person through ego-motion and the look-alike.",
    poster: publicAsset("/assets/posters/demo-02.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-02.mp4"),
  },
  {
    title: "A single click is enough",
    tag: "Similar people · point",
    description: "One point placed on the intended person at the start keeps them through the same look-alike scene.",
    poster: publicAsset("/assets/posters/demo-03.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-03.mp4"),
  },
  {
    title: "Long route with turns",
    tag: "Long route",
    description: "Following the target across a longer indoor route with turns and changing viewpoints.",
    poster: publicAsset("/assets/posters/demo-04.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-04.mp4"),
  },
  {
    title: "Stationary distractor",
    tag: "Distractor",
    description: "Attention stays on the target while a visually salient person stands nearby.",
    poster: publicAsset("/assets/posters/demo-05.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-05.mp4"),
  },
  {
    title: "Pedestrians cross the path",
    tag: "Pedestrian distractor",
    description: "Unrelated pedestrians cross between the robot and the target; identity is held.",
    poster: publicAsset("/assets/posters/demo-06.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-06.mp4"),
  },
  {
    title: "Narrow corridor",
    tag: "Narrow corridor",
    description: "Stable following in a constrained hallway with little room to manoeuvre.",
    poster: publicAsset("/assets/posters/demo-07.jpg"),
    videoSrc: publicAsset("/assets/videos/demo-07.mp4"),
  },
];

export const siteContent = {
  title: "USS: Unifying Spatial-Semantic Prompting for End to End Embodied Visual Tracking",
  shortTitle: "USS",
  date: "June 2026",
  tldr: "Text, a point, a box or a mask: USS lets the scene decide how the target is named, and maps whichever prompt is given to egocentric waypoints with one end-to-end architecture.",
  abstract: [
    "Embodied Visual Tracking (EVT) requires an agent to continuously follow a designated target while moving through dynamic environments. Existing embodied tracking methods generally rely on either an implicit target-selection convention or a language description, leaving the target-specification interface largely fixed. However, different tracking scenarios naturally favor different forms of target specification: language can specify a target outside the robot's current view, whereas spatial prompts provide direct instance designation for visible targets and can be useful for selecting among similar-looking people, designating hard-to-describe individuals, or specifying a target under time pressure. We therefore introduce unified spatial-semantic prompting for EVT, in which text, a point, a box, and a mask serve as complementary target specifications that can be selected according to different scenarios, and present USS, an end-to-end architecture that maps any of them to egocentric waypoints. A modality-specific prompt encoder feeds a common design comprising hybrid-attention fusion, temporal memory, cross-view aggregation, latent prediction, and waypoint decoding, with one policy instance trained for each interface under an identical recipe. Across 320 zero-shot real-robot trials with policies trained only in simulation, spatial prompts perform comparably to language in ordinary tracking scenarios while providing clear benefits when visually similar targets require precise instance designation, supporting our premise that different scenarios favor different target specifications. On simulation EVT-Bench under the standard language-prompt protocol, USS obtains the highest success rate among non-MLLM methods at 57 FPS, against the 4.8–10 FPS reported by MLLM trackers that are stronger on several metrics.",
  ],
  institution: "Nanyang Technological University",
  authors: [
    { name: "Yuchen Xie", note: "equal", href: "https://aresxie.top/" },
    { name: "Xinyu Zhou", note: "equal", href: "https://scholar.google.com/citations?user=Zdm-YgkAAAAJ&hl=en" },
    { name: "Kuangji Zuo" },
    { name: "Yanshuo Lu" },
    { name: "Fengrui Huang" },
    { name: "Boyu Ma" },
    { name: "Jianfei Yang", note: "corresponding", href: "https://marsyang.site/" },
  ] satisfies Author[],
  links: {
    pdf: publicAsset("/assets/docs/USS_paper_copy.pdf"),
    arxiv: "https://arxiv.org/abs/2606.25880",
  },
  figures: {
    motivation: publicAsset("/assets/figures/motivation.png"),
    method: publicAsset("/assets/figures/method.png"),
  },
  contributions: [
    {
      title: "Unified spatial-semantic prompting for EVT",
      points: [
        "Target specification becomes a scenario-dependent choice among language, a point, a bounding box and a mask.",
        "No single interface is assumed in advance.",
      ],
    },
    {
      title: "One end-to-end architecture for all four prompts",
      points: [
        "Modality-specific prompt encoding, read-write-read fusion, temporal memory and cross-view aggregation.",
        "An action-conditioned latent world model regularizes training and is dropped at inference.",
      ],
    },
    {
      title: "Validated on a real robot and on EVT-Bench",
      points: [
        "320 zero-shot trials on a Unitree G1 with simulation-only policies.",
        "Highest success rate among non-MLLM methods on EVT-Bench, at 57 FPS.",
      ],
    },
  ],
  promptModalities: [
    {
      id: "text",
      label: "Text",
      given: "A description of the target, e.g. “follow the man wearing a black shirt and shorts”.",
      encoded: "A frozen PE-Core text encoder; the [CLS] token and the noun tokens become prompt tokens.",
      short: "[CLS] + noun tokens",
      equation: "Y_text  = [h_cls ; h_noun]",
      image: publicAsset("/assets/prompts/text.jpg"),
    },
    {
      id: "point",
      label: "Point",
      given: "One click on the target in the first frame.",
      encoded: "A 160 px pseudo box around the click, pooled from the first-frame tokens with 5×5 RoIAlign into 4 tokens.",
      short: "4 RoIAlign tokens",
      equation: "Y_point = ψ(RoIAlign(V₁, R_pt)) + E",
      image: publicAsset("/assets/prompts/point.jpg"),
    },
    {
      id: "box",
      label: "Box",
      given: "A bounding box drawn around the target in the first frame.",
      encoded: "The box region of the first-frame tokens, pooled with 7×7 RoIAlign into 9 tokens.",
      short: "9 RoIAlign tokens",
      equation: "Y_box   = ψ(RoIAlign(V₁, R_box)) + E",
      image: publicAsset("/assets/prompts/box.jpg"),
    },
    {
      id: "mask",
      label: "Mask",
      given: "A segmentation mask of the target in the first frame.",
      encoded: "A light mask encoder turns it into a dense prior, added to the first-frame tokens and stored in memory as an anchor.",
      short: "dense memory anchor",
      equation: "Y_mask  = V₁ + Flatten(φ(m₁))",
      image: publicAsset("/assets/prompts/mask.jpg"),
    },
  ] satisfies PromptModality[],
  methodSteps: [
    {
      id: "prompt",
      part: "a",
      kicker: "Prompt encoding",
      title: "The person designates the target once",
      body: [
        "At t = 1 the operator gives one prompt, and a modality-specific encoder turns it into a representation compatible with the visual tokens.",
      ],
      linesTag: "Eqs. 2–4 · one encoder per prompt type",
      fine: "Every prompt is encoded once and reused unchanged. After that, only the RGB stream is re-encoded.",
    },
    {
      id: "vision",
      part: "a",
      kicker: "Vision + memory",
      title: "Every view is encoded and given a 16-frame memory",
      body: [
        "A PE-Spatial encoder turns each frame into dense patch tokens; all but its last two blocks are frozen. Each camera view keeps a sliding bank of its recent tokens with a sinusoidal time encoding, and the current tokens attend to it.",
        "A mask prompt is stored in this memory as a persistent target anchor.",
      ],
      lines: ["Zₜ = FFN(CrossAttn(SelfAttn(Vₜ), Kₜ))"],
      linesTag: "Eq. 1 · temporal memory",
      fine: "Without memory, DT success drops by 11.4 points: the largest effect in the ablation.",
    },
    {
      id: "fusion",
      part: "b",
      kicker: "Vision-prompt alignment",
      title: "Prompt and image exchange evidence: read, write, read",
      body: [
        "Ten learnable queries per view join the prompt tokens and self-attend. They then read evidence from the visual tokens, write prompt-conditioned information back to emphasize the designated person and suppress distractors, and read the updated stream once more.",
      ],
      lines: [
        "u′ = SelfAttn([q ; Y])",
        "uʳ = FFN(CrossAttn(u′ ← Z))   read",
        "Zᶠ = CrossAttn(Z ← uʳ)        write",
        "û  = CrossAttn(uʳ ← Zᶠ)       read",
        "Q  = û[1 : 10]",
      ],
      linesTag: "Eqs. 5–8 · hybrid-attention fusion",
      fine: "Only the ten query outputs per view move on; the dense tokens stay behind.",
    },
    {
      id: "head",
      part: "c",
      kicker: "Waypoint prediction head",
      title: "A shared decoder predicts waypoints and whether the target is in view",
      body: [
        "A PETR-style 3D positional encoding places all cameras in one robot frame. A transformer decoder shared across views maps the sparse queries and a presence query to a view-level state and a visibility logit, and a waypoint decoder predicts ten future egocentric waypoints.",
      ],
      lines: ["L_wp   = 1/(2M) · Σᵢ ‖ŵₜ₊ᵢ − w*ₜ₊ᵢ‖₁", "L_pres = BCE(v̂, v*)"],
      linesTag: "Eq. 10 · supervision",
      fine: "Only the first waypoint is executed each control step. If every view's presence falls below 0.5, the controller reuses the next waypoint from the previous prediction instead of re-designating the target.",
    },
    {
      id: "world",
      part: "d",
      kicker: "Action-conditioned world model",
      title: "In training, the policy predicts where its own action leads",
      body: [
        "The predicted waypoints are flattened into an action, fused with the sparse state by an MLP, and a latent predictor forecasts the next sparse state. The target comes from an EMA copy of the whole representation pathway, layer-normalized and detached, and the loss is a SmoothL1 alignment in latent space rather than pixel reconstruction.",
      ],
      lines: ["L = L_wp + 0.05 · L_pres + 0.2 · L_wm"],
      linesTag: "Eq. 13 · overall objective",
      fine: "The EMA branch and the predictor are removed at inference, so they add no runtime cost. Dropping the objective costs 3.2 points of DT success.",
      trainingOnly: true,
    },
  ] satisfies MethodStep[],
  realWorldTable: {
    caption:
      "Real-world success rate across four indoor scenes. 20 trials per scene and prompt type, 320 in total, all zero-shot with a simulation-trained single-view policy.",
    columns: ["Text", "Box", "Point", "Mask"],
    rows: [
      { label: "Narrow corridor", values: ["100%", "100%", "100%", "100%"] },
      { label: "Ped. distractor", values: ["75%", { value: "85%", emphasis: "bold" }, { value: "85%", emphasis: "bold" }, "80%"] },
      { label: "Long route", values: ["70%", { value: "85%", emphasis: "bold" }, "80%", "80%"] },
      {
        label: "Similar people",
        values: ["45%", { value: "90%", emphasis: "bold" }, "80%", "70%"],
        highlight: true,
      },
    ],
    notes: [
      "In the similar-people scene both candidates wear a black top and only the trousers differ, so the description still identifies the target uniquely: a language failure there is a grounding failure.",
    ],
  } as TableData,
  benchmarkTable: {
    caption:
      "EVT-Bench results. STT, DT and AT are Single-Target, Distracted and Ambiguity Tracking, each reported as SR / TR / CR (higher, higher, lower is better).",
    columns: ["SR", "TR", "CR", "SR", "TR", "CR", "SR", "TR", "CR", "FPS"],
    rows: [
      { type: "group", label: "Modular language-prompt baselines (non-MLLM)" },
      { label: "IBVS†", values: ["42.9", "56.2", "3.75", "10.6", "28.4", { value: "6.14", emphasis: "best-a" }, "15.2", { value: "39.5", emphasis: "best-a" }, { value: "4.90", emphasis: "best-a" }, "–"] },
      { label: "PoliFormer†", values: ["4.67", "15.5", "40.1", "2.62", "13.2", "44.5", "3.04", "15.4", "41.5", "–"] },
      { label: "EVT", values: ["24.4", "39.1", "42.5", "3.23", "11.2", "47.9", "17.4", "21.1", "45.6", "15.0"] },
      { label: "EVT‡", values: ["32.5", "49.9", "40.5", "15.7", "35.7", "53.3", "18.3", "21.0", "44.9", "–"] },
      {
        label: "USS (language)",
        highlight: true,
        values: [
          { value: "70.8", emphasis: "best-a" },
          { value: "72.1", emphasis: "best-a" },
          { value: "3.13", emphasis: "best-a" },
          { value: "49.8", emphasis: "best-a" },
          { value: "54.6", emphasis: "best-a" },
          "9.89",
          { value: "34.2", emphasis: "best-a" },
          "35.8",
          "28.2",
          { value: "57.0", emphasis: "best-a" },
        ],
      },
      { type: "group", label: "USS spatial-prompt variants (visible-target initialization; separate protocol)" },
      { label: "USS (point)", highlight: true, values: ["83.4", "86.8", "3.02", "79.8", "80.2", { value: "2.92", emphasis: "bold" }, "–", "–", "–", "68.0"] },
      { label: "USS (mask)", highlight: true, values: ["81.3", "80.8", "6.65", "75.8", "76.3", "3.04", "–", "–", "–", { value: "72.0", emphasis: "bold" }] },
      {
        label: "USS (box)",
        highlight: true,
        values: [
          { value: "86.7", emphasis: "bold" },
          { value: "92.2", emphasis: "bold" },
          { value: "2.73", emphasis: "bold" },
          { value: "83.6", emphasis: "bold" },
          { value: "81.5", emphasis: "bold" },
          "2.93",
          "–",
          "–",
          "–",
          "65.0",
        ],
      },
      { type: "group", label: "MLLM-based language-prompt methods" },
      { label: "Uni-NaVid", values: ["25.7", "39.5", "41.9", "11.3", "27.4", "43.5", "8.26", "28.6", "43.7", "5.0"] },
      { label: "NavFoM¶", values: ["88.4", "80.7", "–", "62.0", "67.9", "–", "–", "–", "–", "5.1"] },
      { label: "TrackVLA", values: ["85.1", "78.6", "1.65", "57.6", "63.2", "5.80", "50.2", "63.7", "17.1", { value: "10.0", emphasis: "best-b" }] },
      {
        label: "TrackVLA++¶",
        values: [
          { value: "90.9", emphasis: "best-b" },
          { value: "82.7", emphasis: "best-b" },
          { value: "1.50", emphasis: "best-b" },
          { value: "74.0", emphasis: "best-b" },
          { value: "73.7", emphasis: "best-b" },
          { value: "3.51", emphasis: "best-b" },
          { value: "55.9", emphasis: "best-b" },
          { value: "63.8", emphasis: "best-b" },
          { value: "15.1", emphasis: "best-b" },
          "4.8",
        ],
      },
    ],
    notes: [
      "Indigo and sky mark the best language-prompt result within the non-MLLM and MLLM groups; bold marks the best spatial-prompt result.",
      "Spatial prompts use visible-target initialization with the initial heading perturbed within ±20°, because an instance can only be designated once it is visible. Those rows are a separate protocol and are not ranked against either language block, including USS's own.",
      "† grounding with GroundingDINO · ‡ with SoM + GPT-4o · ¶ four-view setting.",
    ],
  } as TableData,
  speedComparison: [
    { label: "USS (language)", fps: 57.0, note: "RTX 4090, measured", family: "uss" },
    { label: "EVT", fps: 15.0, note: "RTX 3090, reported", family: "modular" },
    { label: "TrackVLA", fps: 10.0, note: "RTX 4090, reported", family: "mllm" },
    { label: "NavFoM", fps: 5.1, note: "RTX 4090, reported", family: "mllm" },
    { label: "Uni-NaVid", fps: 5.0, note: "A100, reported", family: "mllm" },
    { label: "TrackVLA++", fps: 4.8, note: "RTX 4090, reported", family: "mllm" },
  ] satisfies SpeedEntry[],
  ablation: [
    { label: "Default USS", change: "3 views · WM · 16 frames", sr: 83.6, tr: 81.5, cr: 2.9, isDefault: true },
    { label: "Mem. 32", change: "32-frame memory", sr: 84.1, tr: 82.3, cr: 2.9 },
    { label: "w/o WM", change: "no world-model loss", sr: 80.4, tr: 79.2, cr: 3.0 },
    { label: "Flow-match", change: "flow-matching decoder", sr: 78.8, tr: 79.9, cr: 3.6 },
    { label: "Single view", change: "1 camera, as on the robot", sr: 78.1, tr: 76.3, cr: 3.1 },
    { label: "DDIM", change: "DDIM decoder, 2 steps", sr: 75.8, tr: 76.4, cr: 4.7 },
    { label: "Mem. 0", change: "no temporal memory", sr: 72.2, tr: 73.3, cr: 3.4 },
  ] satisfies AblationRow[],
  heroReel: [
    {
      tag: "Similar people · box prompt",
      title: "A box holds the right person when both wear black",
      poster: publicAsset("/assets/posters/demo-02.jpg"),
      videoSrc: publicAsset("/assets/videos/demo-02.mp4"),
    },
    {
      tag: "Pedestrian distractor",
      title: "Identity held while others cross the path",
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

export function cellValue(cell: Cell) {
  return typeof cell === "string" ? cell : cell.value;
}

/** Parses a "85%" style cell into a number, or null for non-numeric cells. */
export function percent(cell: Cell) {
  const parsed = Number.parseFloat(cellValue(cell));
  return Number.isFinite(parsed) ? parsed : null;
}
