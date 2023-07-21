import {useState, useEffect} from 'react'
import style from './suggestion-drop-down.module.css'

interface SuggestionDropDownProps {
    suggestions: any[];
    templatePerSuggestion: (suggestion: any) => JSX.Element;
}
