export const getSoundSettings = (sound) => {
    let soundVolume = localStorage.getItem(sound);

    let defaultVolume = {
        hoverEffect: 1,
        spinWheelSound: 0.4,
        clickEffect: 1,
        optionSound: 0.2,
        titleBgMusic: 0.2,
        cardPlace: 0.2,
        default:0.2,
        high: 1,
    }

    return soundVolume? soundVolume : defaultVolume[sound];
}

export const shortenLargeNumber = (num, digits) => {
    var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
        decimal;

    for(var i=units.length-1; i>=0; i--) {
        decimal = Math.pow(1000, i+1);

        if(num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }

    return num;
}

export const getDifferenceInDays = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
}

export const getDifferenceInMinutes = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60);
}

export const openExternalLink = (url) => {
    var s = window.open(url, '_blank');

    if (s && s.focus)
    {
        s.focus();
    }
    else if (!s)
    {
        window.location.href = url;
    }
}