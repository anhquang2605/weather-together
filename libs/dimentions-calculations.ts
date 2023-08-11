export function getContentWidth(element:HTMLElement){
    let style = window.getComputedStyle(element);
    let padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    let border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    return element.scrollHeight - padding;
}