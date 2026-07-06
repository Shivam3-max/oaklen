export interface Article {
  slug: string;
  title: string;
  tag: string;
  date: string;
  dek: string;
  body: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "how-to-read-wood-grain",
    title: "How to read a wood grain",
    tag: "Craft Notes",
    date: "June 2026",
    dek: "The lines in a tabletop are a diary. Here is how to read a page of it.",
    body: [
      "Stand at the short end of any solid-wood table and look down its length. The lines you see — some tight, some wandering — are annual rings met at an angle, and they tell you almost everything about the piece.",
      "Tight, parallel lines mean slow growth and hard timber; the tree took its time and the table will too. Wide, swooping figures mean the cut passed near a branch or through tension wood — more dramatic to look at, slightly more restless through the seasons.",
      "At the atelier we match grain the way a tailor matches stripes across a seam. On a Longford, the slab decides; our only job is not to interrupt it. When your piece arrives, find the tightest lines and lay the table so they catch the morning light. You'll see why we kept that log.",
    ],
  },
  {
    slug: "the-case-for-slow-furniture",
    title: "The case for slow furniture",
    tag: "Essay",
    date: "May 2026",
    dek: "Fast furniture is a subscription you didn't mean to take out.",
    body: [
      "A flat-packed sofa costs less on the day and more every year after. It is engineered to an accountant's tolerance: enough particleboard to survive the warranty, not enough to survive a house move.",
      "A commissioned piece inverts the arithmetic. The Bramble costs what three disposable sofas cost — and outlives ten of them. Somewhere around year six, slow furniture quietly becomes the cheapest thing in the room.",
      "But the better argument isn't financial. Objects built by hand carry the builder's patience into the room. You sit differently on a thing that was made for you. Guests notice, though they rarely know what they're noticing. That pause — that's the whole case.",
    ],
  },
  {
    slug: "caring-for-boucle",
    title: "Caring for bouclé, briefly",
    tag: "Care",
    date: "April 2026",
    dek: "Three rules and one myth about the loopiest fabric in the house.",
    body: [
      "Rule one: vacuum monthly with the brush head, low suction, in the direction of the loop. Bouclé holds dust the way a field holds mist — invisibly, until the light angles.",
      "Rule two: blot spills, never rub. A rubbed loop fuzzes; a blotted one forgets. Keep a white cotton cloth within reach of the sofa the way you keep a corkscrew within reach of the table.",
      "Rule three: rotate cushions each season. The myth: that bouclé pills like a cheap sweater. Ours is a high-twist wool-cotton loop; what appears at three months is loose fibre from the weave finding its level, and it stops. A fabric shaver, once, settles the matter for good.",
    ],
  },
];
