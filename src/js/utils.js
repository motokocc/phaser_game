//Used for drawing random Character

let stats;

function generateCharacterStats(rank){
    const skinColor = ["red", "green", "blue", "yellow", "pink", "black", "grey"];
    let randColor = Math.floor(Math.random() * skinColor.length);
    let randomHp = rank + Math.floor(Math.random() * rank);
    let randomAttack = Math.floor(Math.random() * (rank+1));

    stats = {
        rank,
        hp: (5*rank) + randomHp,
        attack: rank + randomAttack,
        speed: rank,
        skinColor: skinColor[randColor]
    }
}


function generateCharacterRank(minRank, maxRank){
    let rank = Math.floor(Math.random() * (maxRank - minRank + 1)) + minRank;
    generateCharacterStats(rank);
}


export function drawCard(drawType) {

    if(drawType == "free"){
        generateCharacterRank(1,2);
    }
    else if(drawType == "rare"){
        generateCharacterRank(2,4);
    }
    else if(drawType == "premium"){
        generateCharacterRank(4,5);
    }
    else{
        generateCharacterRank(1,2);
    }

    return stats;
}