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
}
export default function IntextSuggestion<T extends {}>({ term, handleSuggestionClick, reveal, setReveal, triggerChar, suggestions, suggestionJSX, suggestionContainerClassName, currentCursorPosition, inputRef }: IntextSuggestionProps<T>) {
    const getTextSizeOfRef = (ref: React.MutableRefObject<HTMLTextAreaElement | HTMLInputElement | null>) => {
        if(ref.current){
            return parseFloat(window.getComputedStyle(ref.current).fontSize);
        }
    }
    useEffect(()=>{
        if(reveal){
            //set the suggestion box position based on the cursor position
            if(inputRef && inputRef.current){
                const inputRect = inputRef.current.getBoundingClientRect();
                const inputWidth = inputRect.width;
                const inputHeight = inputRect.height;
                const inputTop = inputRect.top;
                const inputLeft = inputRect.left;
                const suggestionBox = document.querySelector(`.${style['intext-suggestion']}`) as HTMLDivElement;
                const currentTextSize = getTextSizeOfRef(inputRef!);
                console.log(currentTextSize);
                if(suggestionBox){
                    suggestionBox.style.top = `${inputTop + inputHeight + 4}px`;
                    suggestionBox.style.left = `${inputLeft}px`;
                }
            }
        }
    },[reveal])
    return(
        <div className={
            `${suggestionContainerClassName ??  ""} ${style['intext-suggestion']}
            `
        }>
            {suggestionJSX && suggestionJSX(suggestions)}
        </div>
    )
}