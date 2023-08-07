
interface IntextSuggestionProps<T> {
    term: string;
    handleSuggestionClick: (suggestion: T) => void;
    setReveal: (reveal: boolean) => void;
    triggerChar: string; //the char that trigger the suggestion box
    suggestions: T[];
    suggestionJSX?: (suggestion: T) => JSX.Element;
    enableSuggestionMark?: boolean; //if true, the suggestion will be highlighted in the text
    suggestionMarkType?: string; //the pattern to mark the suggestion in the text;
    inputRef : React.RefObject<HTMLInputElement>;
    currentCursorPosition: number;//parent will have to handle this
}
export default function IntextSuggestion<T>({ term, handleSuggestionClick, setReveal, triggerChar, suggestions, suggestionJSX }: IntextSuggestionProps<T>) {
    
}