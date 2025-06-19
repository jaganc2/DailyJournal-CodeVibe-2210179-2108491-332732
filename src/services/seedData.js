// Seed data for the journal application
import journalDB from './db.js';

// Function to generate a random date within the last 3 months
const getRandomDate = () => {
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  
  return new Date(
    threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime())
  ).toISOString();
};

// Function to get emotions based on mood value (copied from JournalEntry.jsx to ensure consistency)
const getEmotionsForMood = (value) => {
  if (value <= 2) {
    return ["Angry", "Scared", "Annoyed", "Frustrated", "Anxious", "Stressed"];
  } else if (value <= 4) {
    return ["Sad", "Disappointed", "Lonely", "Tired", "Bored", "Confused"];
  } else if (value === 5) {
    return ["Calm", "Focused", "Content", "Neutral", "Relaxed", "Mindful"];
  } else if (value <= 7) {
    return ["Happy", "Optimistic", "Grateful", "Motivated", "Proud", "Peaceful"];
  } else {
    return ["Excited", "Joyful", "Inspired", "Energetic", "Enthusiastic", "Thrilled"];
  }
};

// Function to get mood text based on mood value (copied from JournalEntry.jsx to ensure consistency)
const getMoodText = (value) => {
  if (value <= 2) return "Very Unpleasant";
  if (value <= 4) return "Unpleasant";
  if (value === 5) return "Neutral";
  if (value <= 7) return "Pleasant";
  return "Very Pleasant";
};

// Sample journal entries with variety
const sampleEntries = [
  // Very Unpleasant (1-2)
  {
    journal: "Today was incredibly difficult. I had a major argument with my team lead about the project direction. I feel like my ideas are constantly being dismissed without proper consideration.",
    moodValue: 1,
    tag: "Office",
    emotion: "Angry"
  },
  {
    journal: "I just heard about the layoffs coming next month. I'm really worried about my position here and how I'll manage if I lose this job.",
    moodValue: 2,
    tag: "Office",
    emotion: "Anxious" 
  },
  {
    journal: "My car broke down on the way to an important meeting. Had to call a tow truck and missed the entire presentation I was supposed to give.",
    moodValue: 1,
    tag: "Personal",
    emotion: "Frustrated"
  },
  {
    journal: "Found out my sister has been talking behind my back to other family members. Really hurt by this betrayal from someone I trust.",
    moodValue: 2,
    tag: "Family",
    emotion: "Annoyed"
  },
  {
    journal: "Having panic attacks again. The therapy techniques aren't working like they used to. Might need to talk to my doctor about adjusting my treatment plan.",
    moodValue: 2,
    tag: "Personal",
    emotion: "Scared"
  },
  {
    journal: "Third deadline extension this month. The client keeps changing requirements and it's impossible to make progress. Everyone on the team is burned out.",
    moodValue: 1,
    tag: "Office",
    emotion: "Stressed"
  },
  
  // Unpleasant (3-4)
  {
    journal: "Feeling down today. The weather is gloomy and I couldn't find motivation to work on my side project. Just want this day to end.",
    moodValue: 4,
    tag: "Personal",
    emotion: "Sad"
  },
  {
    journal: "Missed my fitness goals again this week. Starting to wonder if I'll ever get back in shape. Need to find a better routine that I can stick to.",
    moodValue: 3,
    tag: "Personal",
    emotion: "Disappointed"
  },
  {
    journal: "Most of my friends are away for the long weekend. Stayed home scrolling through social media and feeling left out of everyone's adventures.",
    moodValue: 3,
    tag: "Personal",
    emotion: "Lonely"
  },
  {
    journal: "My parents keep bringing up why I'm still single at family gatherings. Wish they would understand how their comments make me feel.",
    moodValue: 4,
    tag: "Family",
    emotion: "Tired"
  },
  {
    journal: "Nothing interesting at work lately. Same meetings, same tasks, same people. Need to find more challenging projects or consider looking elsewhere.",
    moodValue: 4,
    tag: "Office",
    emotion: "Bored"
  },
  {
    journal: "Trying to decide between job offers. Each has pros and cons and I'm afraid of making the wrong choice. Wish the path forward was clearer.",
    moodValue: 3,
    tag: "Office",
    emotion: "Confused"
  },
  {
    journal: "Uncle's health is deteriorating. The family is discussing care options but can't agree on what's best. These decisions are so hard.",
    moodValue: 3,
    tag: "Family",
    emotion: "Sad"
  },
  
  // Neutral (5)
  {
    journal: "Average day at the office. Completed my regular tasks and had lunch with colleagues. Nothing particularly good or bad to report.",
    moodValue: 5,
    tag: "Office",
    emotion: "Neutral"
  },
  {
    journal: "Did some grocery shopping and caught up on laundry. Routine maintenance day. Planning to read that new novel tonight.",
    moodValue: 5,
    tag: "Personal",
    emotion: "Calm"
  },
  {
    journal: "Family dinner was fine. The usual conversations and debates, but everyone got along well enough. Made plans for next month's reunion.",
    moodValue: 5,
    tag: "Family",
    emotion: "Content"
  },
  {
    journal: "Working on the quarterly report. Numbers are neither great nor terrible. Management seems satisfied with the progress.",
    moodValue: 5,
    tag: "Office",
    emotion: "Focused"
  },
  {
    journal: "Started meditating again after a long break. Didn't have any profound insights but felt a bit more centered afterward.",
    moodValue: 5,
    tag: "Personal",
    emotion: "Mindful"
  },
  {
    journal: "Taking a break from social media today. Spent time just existing without pressure to document everything. Quite refreshing actually.",
    moodValue: 5,
    tag: "Personal",
    emotion: "Relaxed"
  },
  {
    journal: "Coffee meetup with an old colleague. Good to catch up but we've grown in different directions. Interesting to see how careers evolve.",
    moodValue: 5,
    tag: "Other",
    emotion: "Neutral"
  },
  
  // Pleasant (6-7)
  {
    journal: "Made good progress on the website redesign today. The client loved the mockups and we're ahead of schedule for once.",
    moodValue: 7,
    tag: "Office",
    emotion: "Happy"
  },
  {
    journal: "Morning jog felt great today. Beat my personal record and the endorphins are flowing. Healthy breakfast afterward made it perfect.",
    moodValue: 6,
    tag: "Personal",
    emotion: "Motivated"
  },
  {
    journal: "Sister announced she's expecting! I'm going to be an aunt/uncle. Already thinking about all the fun things we'll do together.",
    moodValue: 7,
    tag: "Family",
    emotion: "Optimistic"
  },
  {
    journal: "Received positive feedback on my presentation from the department head. All that preparation was worth it!",
    moodValue: 6,
    tag: "Office",
    emotion: "Proud"
  },
  {
    journal: "Took time to appreciate the simple things today - good coffee, sunshine, and a short walk in the park. Life isn't so bad.",
    moodValue: 6,
    tag: "Personal",
    emotion: "Grateful"
  },
  {
    journal: "Finally resolved that lingering conflict with my roommate. Good communication really does wonders for relationships.",
    moodValue: 7,
    tag: "Other",
    emotion: "Peaceful"
  },
  {
    journal: "Mom's birthday dinner went really well. Everyone got along and she loved the gift we all pitched in for. Great family evening.",
    moodValue: 7,
    tag: "Family",
    emotion: "Happy"
  },
  {
    journal: "Volunteered at the animal shelter today. Seeing those dogs find forever homes was incredibly rewarding. Might make this a regular thing.",
    moodValue: 6,
    tag: "Other",
    emotion: "Grateful"
  },
  
  // Very Pleasant (8-9)
  {
    journal: "Got the promotion!! All those late nights and extra projects paid off. Celebrating tonight with close friends!",
    moodValue: 9,
    tag: "Office",
    emotion: "Excited"
  },
  {
    journal: "Surprise weekend getaway with my partner was amazing. Exactly what we needed after months of hard work. Feeling completely recharged.",
    moodValue: 9,
    tag: "Personal",
    emotion: "Joyful"
  },
  {
    journal: "Family reunion was incredible. Some relatives I haven't seen in years made it. So many stories, laughs, and good food!",
    moodValue: 8,
    tag: "Family",
    emotion: "Enthusiastic"
  },
  {
    journal: "Completed my first marathon! The training was worth every blister and early morning. Still riding the runner's high!",
    moodValue: 9,
    tag: "Personal",
    emotion: "Thrilled"
  },
  {
    journal: "Our team won the innovation challenge at work! The prototype we've been developing for months impressed everyone. So proud of what we accomplished together.",
    moodValue: 8,
    tag: "Office",
    emotion: "Energetic"
  },
  {
    journal: "Had a breakthrough on that creative project I've been stuck on for weeks. Ideas are flowing and I can't wait to bring this vision to life!",
    moodValue: 8,
    tag: "Personal",
    emotion: "Inspired"
  },
  {
    journal: "The charity event I organized raised twice our goal! All the planning was worth it seeing how many people will be helped.",
    moodValue: 9,
    tag: "Other",
    emotion: "Joyful"
  },
  
  // Additional diverse entries
  {
    journal: "Started learning piano today. The basics are challenging but I'm excited about this new creative outlet.",
    moodValue: 7,
    tag: "Personal",
    emotion: "Motivated"
  },
  {
    journal: "Tough conversation with my teenager about their falling grades. Trying to be supportive while emphasizing responsibility.",
    moodValue: 4,
    tag: "Family",
    emotion: "Concerned"
  },
  {
    journal: "Company announced a merger. Lots of uncertainty about what this means for our department. Trying to stay positive.",
    moodValue: 3,
    tag: "Office",
    emotion: "Anxious"
  },
  {
    journal: "Adopted a rescue cat today! She's still shy but already found her favorite spot on the couch. Heart = full.",
    moodValue: 8,
    tag: "Personal",
    emotion: "Enthusiastic"
  },
  {
    journal: "Neighbors had another loud party until 2am. Fourth time this month and management isn't doing anything. Exhausted.",
    moodValue: 2,
    tag: "Other",
    emotion: "Frustrated"
  },
  {
    journal: "Made a home-cooked meal for my parents. Mom said it reminded her of grandma's recipe. Special moment.",
    moodValue: 7,
    tag: "Family",
    emotion: "Grateful"
  },
  {
    journal: "First day at the new job. Everyone seems nice but it's overwhelming learning all the systems and names.",
    moodValue: 5,
    tag: "Office",
    emotion: "Focused"
  },
  {
    journal: "Found out my best friend is moving across the country. Happy for their opportunity but will miss them terribly.",
    moodValue: 4,
    tag: "Personal",
    emotion: "Bittersweet"
  },
  {
    journal: "The community garden project is finally happening! Got approval for the vacant lot and several neighbors have volunteered.",
    moodValue: 8,
    tag: "Other",
    emotion: "Inspired"
  },
  {
    journal: "Therapy breakthrough today. Finally connected some dots about patterns from my childhood affecting current relationships.",
    moodValue: 6,
    tag: "Personal",
    emotion: "Enlightened"
  },
  {
    journal: "Annual review was better than expected. Manager acknowledged my contributions and I got a decent raise.",
    moodValue: 7,
    tag: "Office",
    emotion: "Proud"
  },
  {
    journal: "Grandpa shared stories from his youth today. Recorded some of them so the family history won't be lost. Precious time.",
    moodValue: 6,
    tag: "Family",
    emotion: "Nostalgic"
  }
];

// Function to seed the database with sample journal entries
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // First check if there are already entries in the database
    const existingEntries = await journalDB.getAllEntries();
    
    // Only seed if there are fewer than 10 entries
    if (existingEntries.length < 10) {
      console.log(`Found only ${existingEntries.length} entries. Seeding database with sample data...`);
      
      // Process each sample entry and add to the database
      const seedPromises = sampleEntries.map(entry => {
        // Generate a random date within the last 3 months
        const date = getRandomDate();
        
        // Create the full entry object
        const fullEntry = {
          journal: entry.journal,
          moodValue: entry.moodValue,
          mood: `${getMoodText(entry.moodValue)} (${entry.moodValue}/9)`,
          tag: entry.tag,
          emotion: entry.emotion,
          date: date
        };
        
        // Add to database
        return journalDB.addEntry(fullEntry);
      });
      
      // Wait for all entries to be added
      await Promise.all(seedPromises);
      console.log(`Successfully seeded database with ${sampleEntries.length} entries!`);
      return {
        success: true,
        message: `Added ${sampleEntries.length} sample journal entries.`
      };
    } else {
      console.log('Database already has sufficient entries. Skipping seeding.');
      return {
        success: false,
        message: 'Database already contains enough entries. Seeding skipped.'
      };
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      message: `Failed to seed database: ${error.message}`
    };
  }
}

export { seedDatabase };
