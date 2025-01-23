import anime from 'animejs';
type AnimeObject = {
    targets: string,


}
export const pathRevealAnimation = (target: string, easing: string, duration: number, animationCreated: boolean = true) => {
    const animObj ={
        targets: target,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: easing,
        duration: duration,
        
    }
    if(animationCreated){
        const anim = anime(animObj)
        return anim
    }
    return animObj;
}

export const pathShrinkAnimation = (target: string, easing: string, duration: number, animationCreated: boolean = true) => {
    const animObj = {
        targets: target,
        strokeDashoffset: [0, anime.setDashoffset],
        easing: easing,
        duration: duration
    }
    if(animationCreated){
        const anim = anime(animObj)
        return anim
    }
    return animObj;
}

export const followPathAnimation = (target: string, easing: string, duration: number, path: string  ) => {
    const anim = anime({
        targets: target,
        d: path,
        easing: easing,
        duration: duration
    })
    return anim
}



