import React from "react";
import style from "./intext-suggestion.module.css";
import { useEffect } from "react";
import { current } from "@reduxjs/toolkit";
interface IntextSuggestionProps<T> {
    term: string;
    handleSuggestionClick: (suggestion: T) => void;
    setReveal: React.Dispatch<React.SetStateAction<boolean>>;
    reveal: boolean;
    triggerChar: string; //the char that trigger the suggestion box
    suggestions: T[];
    suggestionJSX?: (suggestions: T[]) => React.JSX.Element[];
    enableSuggestionMark?: boolean; //if true, the suggestion will be highlighted in the text
    suggestionMarkType?: string; //the pattern to mark the suggestion in the text;
    inputRef : React.MutableRefObject<HTMLTextAreaElement | HTMLInputElement | null>;
    currentCursorPosition: number;//parent will have to handle this
    suggestionContainerClassName?: string;
    content: string;
}
export default function IntextSuggestion<T extends {}>({ term, handleSuggestionClick, reveal, setReveal, triggerChar, suggestions, suggestionJSX, suggestionContainerClassName, currentCursorPosition, inputRef, content}: IntextSuggestionProps<T>) {
    const getTextSizeOfRef = (ref: React.MutableRefObject<HTMLTextAreaElement | HTMLInputElement | null>) => {
        if(ref.current){
            return parseFloat(window.getComputedStyle(ref.current).fontSize);
        }
    }
    useEffect(()=>{
        if(reveal){
            //set the suggestion box position based on the cursor position
            if(inputRef && inputRef.current){
                const input = inputRef.current;
                const inputRect = input.getBoundingClientRect();
                const inputWidth = inputRect.width;

                const inputTop = input.offsetTop;
                const inputLeft = input.offsetLeft;
                const suggestionBox = document.querySelector(`.${style['intext-suggestion']}`) as HTMLDivElement;
                const renderedContent = document.querySelector(`.${style['content-rendered']}`) as HTMLDivElement;
                renderedContent.style.width = `${inputWidth}px`;
                renderedContent.style.top = `${inputTop}px`;
                renderedContent.style.left = `${inputLeft}px`;
                const renderedContentHtml = renderedContent.innerHTML;
                const newContent = renderedContentHtml.replace(/:/g, '<span class="insertion-point"></span>')
                renderedContent.innerHTML = newContent;
                const lineHeight = parseFloat(window.getComputedStyle(inputRef.current).lineHeight);
                
                const insertionPoint = document.querySelector(`.${style['content-rendered']} .insertion-point`) as HTMLSpanElement;
                if(insertionPoint){
                    const insertionPointTop = insertionPoint.offsetTop;
                    const insertionPointLeft = insertionPoint.offsetLeft;
                    if(suggestionBox){
                        suggestionBox.style.top = `${insertionPointTop + inputTop + lineHeight + 4}px`;
                        suggestionBox.style.left = `${insertionPointLeft + inputLeft}px`;
                    }
                }     
            }
        }
    },[reveal])
    return(
        <>
            <div className={style['content-rendered']}>
                {content}
            </div>
            <div className={
                `${suggestionContainerClassName ??  ""} ${style['intext-suggestion']}
                `
            }>
                {suggestionJSX && suggestionJSX(suggestions)}
            </div>
        </>
    )
}