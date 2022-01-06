export const skills = [
    {
        itemId: 600,
        name: "Fire ball",
        description: "Attack enemies with fireball that has 10% chance of burning them. (DMG: 120% ATK, CD: 20s)",
        price: 1000,
        priceCurrency: "gold",
        properties: {
        	type: "skill",
        	attribute: ["fire"]
        }
    },
    {
        itemId: 601,
        name: "Ice spikes",
        description: "Attack enemies with ice spikes from the ground that has 10% chance of freezing them for 1.5s. (DMG: 120% ATK, CD: 20s)",
        price: 1000,
        priceCurrency: "gold",
        properties: {
        	type: "skill",
        	attribute: ["water"]
        }
    }, 
    {
        itemId: 602,
        name: "War cry",
        description: "Increases djinn's attack, crit rate and crit damage by 25% when its health is below 20% (Passive)",
        price: 2500,
        priceCurrency: "gold",
        properties: {
        	type: "skill",
        	attribute: ["fire", "water"]
        }
    }, 
    {
        itemId: 603,
        name: "Meteor rain",
        description: "Hit enemies with balls of fires that has 20% chance of burning them(DMG: 160%, CD: 45s)",
        price: 2500,
        priceCurrency: "gems",
        properties: {
        	type: "skill",
        	attribute: ["fire"]
        }
    }, 
    {
        itemId: 604,
        name: "Icicle spears",
        description: "Throws icicle spears on enemies which has 15% chance of freezing them for 3s (DMG: 160%, CD: 45s)",
        price: 2500,
        priceCurrency: "gems",
        properties: {
        	type: "skill",
        	attribute: ["water"]
        }
    },   
    {
        itemId: 605,
        name: "Fatal wounds",
        description: "If your enemy is inflicted by burn or freeze, your attacks deals 25% more damage (Passive)",
        price: 2000,
        priceCurrency: "gems",
        properties: {
        	type: "skill",
        	attribute: ["fire", "water"]
        }
    }, 
];

export const items = [
    {
        itemId: 700,
        name: "Small heal potion",
        description: "Heals 25% of HP during battles",
        price: 20,
        priceCurrency: "gold",
        properties: {
        	type: "item",
        	attribute: []
        }
    },
    {
        itemId: 701,
        name: "Iron pickaxe",
        description: "Use for mining minerals, gold and gems in level 1 mining area.",
        price: 500,
        priceCurrency: "gems",
        properties: {
        	type: "item",
        	attribute: []
        }
    }
];