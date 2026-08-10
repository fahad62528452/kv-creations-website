export type Founder = {
  name: string
  role: string
  portrait: string
  portraitAlt: string
  /** Brand storytelling line for the home founders section */
  headline: string
  summary: string
  bio: string[]
  gallery: Array<{ src: string; alt: string; caption: string }>
}

export const founders: Founder[] = [
  {
    name: 'Rithika Konda',
    role: 'Founder & Design Head',
    portrait: '/images/founders/rithika-portrait.jpg',
    portraitAlt:
      'Black and white studio portrait of Rithika Konda, founder of KV Creations',
    headline: 'Your story is not a template.',
    summary:
      'KV Creations began with a love for celebrations, beautiful spaces, and the emotions that live within them.',
    bio: [
      'KV Creations began with something much more personal than a business idea: a love for celebrations, beautiful spaces, and the emotions that live within them.',
      'For me, weddings have never been just about décor, timelines, or perfectly executed setups. They are about the little things that make a celebration yours: the memories, the people, the traditions, and the emotions that make that day impossible to recreate.',
      'No two stories are alike. Neither should be the celebrations that tell them.',
      'I believe your memories are not templates. So why should your wedding be one?',
      'Every celebration we create begins with understanding the people behind it. Their story, their personalities, their traditions, their relationships, and the feeling they want their guests to take home.',
      'We don’t believe in creating beautiful spaces simply because they look beautiful. Every colour, flower, texture, detail and design choice has a reason to exist. We create with intention, turning personal stories into immersive experiences that feel effortless, meaningful and entirely yours.',
      'For me, KV Creations is not simply a business. It is something I have poured my heart, imagination and countless hours into. I find joy in taking an idea that exists only in someone’s mind and watching it slowly become real, right down to the smallest detail.',
      'Because at the end of the day, we don’t just design weddings. We create the feeling you remember long after the celebrations are over.',
    ],
    gallery: [
      {
        src: '/images/founders/rithika-atelier.jpg',
        alt: 'Rithika arranging florals at an outdoor celebration table',
        caption: 'In the atelier of the day, shaping florals and table light.',
      },
      {
        src: '/images/founders/rithika-direction.jpg',
        alt: 'Rithika directing on site with a laptop outdoors',
        caption: 'On the ground, directing the atmosphere as it takes form.',
      },
      {
        src: '/images/founders/rithika-evening.jpg',
        alt: 'Rithika at a festive evening gathering',
        caption: 'Presence through the evening, from first light to last cue.',
      },
      {
        src: '/images/founders/rithika-production.jpg',
        alt: 'Rithika coordinating production inside a large venue',
        caption: 'Large-room production, headset on, every detail held.',
      },
      {
        src: '/images/founders/team-site.jpg',
        alt: 'KV Creations team overlooking an outdoor event setup',
        caption: 'The team reading the room before guests arrive.',
      },
      {
        src: '/images/founders/arena-production.jpg',
        alt: 'Behind-the-scenes view of a large arena production',
        caption: 'Scale when the celebration asks for it.',
      },
    ],
  },
]
