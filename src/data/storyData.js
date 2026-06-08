export const navigationLinks = [
  { label: 'About', href: '#about', type: 'anchor' },
  { label: 'How It Works', href: '#how', type: 'anchor' },
  { label: 'Stories', href: '/family-library', type: 'route' }
]

export const recentMemories = [
  { year: '1958', title: 'The Birthday Cake', subtitle: 'A playful afternoon with candles and laughter.' },
  { year: '1964', title: 'First Bicycle Ride', subtitle: 'Wind through the park and a proud first ride.' },
  { year: '1975', title: 'Wedding Day', subtitle: 'The beginning of a lifetime together.' }
]

export const storybookPages = [
  {
    title: 'The Birthday Under The Mango Tree',
    copy: 'Golden afternoon light poured through the leaves as Grandma tucked the last candle into the cake. Every laugh became a thread in the story that would travel for generations.',
    art: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'The Secret Garden Drawing',
    copy: 'The little hands painted the garden of memories, where every flower held a voice and every line was a promise of another story to come.',
    art: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'A Letter for Tomorrow',
    copy: 'A gentle voice carried through the page, inviting the child to answer with a heart, a drawing, or a voice note full of wonder.',
    art: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80'
  }
]

export const libraryStories = [
  {
    id: 'birthday-mango-tree',
    title: 'The Birthday Under The Mango Tree',
    date: '1962-05-14',
    snippet: 'A warm afternoon memory turned into a treasured legacy.',
    pages: [
      {
        title: 'A Whispered Wish',
        copy: 'Grandma lit the candle and everyone leaned in. The air was warm with love, and the memory became the first page of something timeless.'
      },
      {
        title: 'A Circle of Laughter',
        copy: 'The cake glowed beneath the mango tree as stories bloomed around the table, each one carrying a gentle promise.'
      }
    ]
  },
  {
    id: 'secret-garden-drawing',
    title: 'The Secret Garden Drawing',
    date: '1968-09-03',
    snippet: 'A story of imagination, color, and family warmth.',
    pages: [
      {
        title: 'Painted Memories',
        copy: 'The paper filled with leaves and light, each brushstroke a whisper of a cherished afternoon.'
      },
      {
        title: 'A Story That Grows',
        copy: 'Every drawing felt like a branch reaching into the future, inviting the child to be part of the story.'
      }
    ]
  },
  {
    id: 'letter-for-tomorrow',
    title: 'A Letter for Tomorrow',
    date: '1979-11-18',
    snippet: 'A gentle message that became part of the family storybook.',
    pages: [
      {
        title: 'A Quiet Invitation',
        copy: 'A letter was written with soft ink and softer memories, meant for the hearts of those who would come after.'
      },
      {
        title: 'Stories Carried Forward',
        copy: 'The words formed a bridge between afternoons past and moments yet to arrive.'
      }
    ]
  }
]

export const legacyEvents = [
  {
    id: 'birthday-mango-tree',
    year: '1958',
    title: 'First Day at School',
    subtitle: 'Nervous feet stepping into a new world of learning and story.',
    details: 'A crisp morning, a satin ribbon, and a small hand tucked into a parent’s palm. The beginning of many chapters.'
  },
  {
    id: 'secret-garden-drawing',
    year: '1964',
    title: 'First Bicycle Ride',
    subtitle: 'Wind through the park and a proud first ride.',
    details: 'A wobbly start and the instant of balance, when a child became a little more themselves.'
  },
  {
    id: 'letter-for-tomorrow',
    year: '1975',
    title: 'Wedding Day',
    subtitle: 'The beginning of a lifetime together.',
    details: 'Words sealed with a kiss, people gathered in warm light, and a promise whispered into a quiet room.'
  }
]

export const familyTree = [
  {
    role: 'Grandparent',
    items: ['Memories', 'Storybooks', 'Voice Notes']
  },
  {
    role: 'Grandchild',
    items: ['Drawings', 'Questions', 'Responses']
  }
]
