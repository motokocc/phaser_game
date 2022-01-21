export const playerInitData = {
    name: '',
    address: null,
    drawCount: 0,
    gold: 0,
    gems: 0,
    level: 1,
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
    }
}