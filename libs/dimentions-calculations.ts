export function getContentHeight(element:HTMLElement){
    let style = window.getComputedStyle(element);
    let padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    let border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    return element.scrollHeight - padding;
}
export function getContentWidth(element:HTMLElement){
    let style = window.getComputedStyle(element);
    let padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    let border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    return element.scrollWidth - padding;
}
export function getDistanceFromTopOfScrollableParent(element:HTMLElement, parent:HTMLElement){
    let elementRect = element.getBoundingClientRect();
    let parentRect = parent.getBoundingClientRect();
    let elementTop = elementRect.top - parentRect.top;
    if(elementTop < 0){
        return elementTop + parent.scrollTop;
    }
    return elementTop;
}
export function getDistanceFromLeftOfScrollableParent(element:HTMLElement, parent:HTMLElement){
    let elementRect = element.getBoundingClientRect();
    let parentRect = parent.getBoundingClientRect();
    let elementLeft = elementRect.left - parentRect.left;
    if(elementLeft < 0){
        return elementLeft + parent.scrollLeft;
    }
    return elementLeft;
}