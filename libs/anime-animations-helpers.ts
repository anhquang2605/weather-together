import anime from 'animejs';
export const pathShrinkAnimation = (target: string, easing: string, duration: number) => {
    const anim = anime({
        targets: target,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: easing,
        duration: duration
    })
    return anim
}

export const pathRevealAnimation = (target: string, easing: string, duration: number) => {
    const anim = anime({
        targets: target,
        strokeDashoffset: [0, anime.setDashoffset],
        easing: easing,
        duration: duration
    })
    return anim
}

