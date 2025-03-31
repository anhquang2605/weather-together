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

export const pathShrinkForwardAnimation = (target: string, easing: string, duration: number, animationCreated: boolean = true) => {
    const path = document.querySelector(target) as SVGPathElement;
    const pathLength = path.getTotalLength();
    const animObj = {
        targets: target,
        strokeDashoffset: -pathLength,
        easing: easing,
        duration: duration,
        //direction: 'reverse'
    }
    if(animationCreated){
        const anim = anime(animObj)
        return anim
    }
    return animObj;
}
const individualPathLengthShrinkForwardAnimation = (target: string, easing: string, duration: number) => {
    const targets = document.querySelectorAll(target) as NodeListOf<SVGPathElement>;
    const animObjs = [];
    for (let i = 0; i < targets.length; i++) {
        const path = targets[i];
        const pathLength = path.getTotalLength();
        const animObj = {
            targets: target,
            strokeDashoffset: -pathLength,
            easing: easing,
            duration: duration,
            //direction: 'reverse'
        }
        animObjs.push(animObj);
    }
    return animObjs
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

export const propertiesStagesAnimation = (targets: string, easing: string, duration: number, properties: {[animationProperty: string]: any}, animationCreated: boolean = true) => {
    //properties is a list of objects, each object represent a property to animate whose values is an array of values to animate
    const animObj = {
        targets: targets,
        ...properties,
        easing: easing,
        duration: duration,
        loop: true
    }
    if(animationCreated){
        const anim = anime(animObj)
        return anim
    }else{
        return animObj
    }
}

