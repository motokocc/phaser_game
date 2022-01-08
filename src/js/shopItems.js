export const skills = [
    {
        itemId: 600,
        name: "Fire ball",
        description: "Attack enemies with fireball that has a 10% chance of burning them (-1% hp/sec). (DMG: 120% ATK, CD: 20s)",
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
        description: "Attack enemies with ice spikes that has 10% chance of freezing them for 1.5 seconds. (DMG: 120% ATK, CD: 20s)",
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
        description: "Increases djinn's attack, critical rate and critical damage by 25% when its health is below 20%. (Passive)",
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
        description: "Hit enemies with balls of fire that has 20% chance of burning them (-1% hp/sec). (DMG: 160%, CD: 45s)",
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
        description: "Attack enemies with icicle spears which has 15% chance of freezing them for 3 seconds (DMG: 160%, CD: 45s)",
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
        description: "If your enemy is inflicted by any status condition, your djinn's attacks deals 25% more damage. (Passive)",
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
        description: "Potion brewed by wizards used by novice adventurers that replenishes 25% of their health during battles",
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
        description: "Use for mining minerals, gold and gems which also serves as an access pass in the mining area's first few levels. ",
        price: 500,
        priceCurrency: "gems",
        properties: {
        	type: "item",
        	attribute: []
        }
    }
];