export const playerInitData = {
    name: '',
    address: null,
    drawCount: 0,
    gold: 3000,
    gems: 3000,
    level: 1,
    currentXp: 0,
    levelupXp: 100,
    role: "Adventurer",
    dateJoined: null,
    lastLogin: new Date(),
    lastSpin: null,
    lastReward: null,
    isFirstTime: true,
    lastRead: 0,
    couponCodes:[],
    rewards: 0,
    inventory:{
        skill:[],
        item:[],
        card:[]
    },
    missions:{
        finished: [],
        currentMission: null    
    },
    cardsBattleData:[]
}