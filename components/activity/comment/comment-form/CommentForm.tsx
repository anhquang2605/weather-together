
import React,{useState, useEffect, useRef, use} from 'react'
import { insertToPostAPI, uploadFileToPostAPI } from '../../../../libs/api-interactions';
import style from './comment-form.module.css';
import MiniAvatar from '../../../user/mini-avatar/MiniAvatar';
import {IoCamera,IoSend, IoClose} from 'react-icons/io5';
import EmojiSelector from '../../text-editing/emoji-selections/EmojiSelector';
import IntextSuggestion from '../../text-editing/intext-suggestion/IntextSuggestion';
import { EMOJIS } from '../../../../constants/emojis';
import { Emoji } from '../../../../types/Emoji';
import NextImage from 'next/image';
import { Comment } from '../../../../types/Comment';
import { Picture } from '../../../../types/Picture';
import { usePostModalContext } from '../../post/post-modal-context/PostModalContext';
interface ErrorMessage {
    message: string,
    type: string //picture-attachment, content-length
}
interface CommentFormProps {
    preview?: boolean,
    targetId: string,//will be "" if comment on post
    username: string,
    name?: string,
    targetLevel?: number, //for comment on comment, if none, then the target is a post or picture, whoever call this will have level = target level + 1 but 0 if target is a post or picture
    postId: string,//can also be the picture id
    isCommenting: boolean,
    scrollToCommentForm: ( CommentForm: React.MutableRefObject<HTMLDivElement | null> ) => void,
    userProfilePicturePath: string,
    targetType: string, //posts or comments or pictures
    parentListRef?: React.MutableRefObject<HTMLDivElement | null>,
    setIsCommenting: React.Dispatch<React.SetStateAction<boolean>>,
    optimisticCommentInsertion: (comment: Comment) => void,
    _id: string,
    forPost?: boolean,
}
export interface CommentFormState {
    content: string,
    picture: File | undefined,
    pictureAttached: boolean,
    previewPictureURL: string,
    previewRatio: number,
    previewPictureDimensions: number[],
    errorMessages: ErrorMessage[],
    validContentLength: boolean,
    currentCursorPosition: number,
    suggestions: Emoji[],
    revealEmojiSuggestions: boolean,
    emojiSuggestionTerm: string,
}
export default function CommentForm({targetId, name, username, targetLevel, postId, isCommenting, scrollToCommentForm, userProfilePicturePath, targetType, parentListRef, setIsCommenting, _id,optimisticCommentInsertion, preview, forPost}: CommentFormProps) {
    const {commentFormState, setCommentFormState, curPostId, show} = usePostModalContext();
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [pictureAttached, setPictureAttached] = useState(false);
    const [picture, setPicture] = useState<File>();
    const [previewPictureURL, setPreviewPictureURL] = useState<string>('');
    const [previewRatio, setPreviewRatio] = useState<number>(0); //[width, height
    const [previewPictureDimensions, setPreviewPictureDimensions] = useState<number[]>([0,0]); //[width, height
    const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([]);
    const [validContentLength, setValidContentLength] = useState(false); //min should be 1 word
    const commentFormRef = useRef<HTMLDivElement | null>(null);
    /*************************SUGGESTIONS EMOJIS SECTIONS***********************/
    //intext suggestions state, used to provide props for intext suggestion component
    const [currentCursorPosition, setCurrentCursorPosition] = useState(0);
    const [suggestions, setSuggestions] = useState<Emoji[]>(EMOJIS);
    const [revealEmojiSuggestions, setRevealEmojiSuggestions] = useState(false);
    const [emojiSuggestionTerm, setEmojiSuggestionTerm] = useState(''); //the term that is used to filter the suggestions
    const contentTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const triggerChar = ':';
    const renderSuggestion = (suggestion: Emoji, index:number) => {
        return(
            
                <div key={suggestion.name} title={suggestion.name} className={`${style['emoji-intext-suggestion-item']} ${index === 0 ? style['top-suggestion'] : ""}`} onClick={()=>{handleEmojiSuggestionChose(suggestion)}}>
                    {suggestion.emoji}
                </div>
            
        )
    }
    const handleEmojiSuggestionFilter = (term: string) => {
        const filteredEmojis = EMOJIS.filter(emoji => emoji.name.toLowerCase().includes(term));
        setSuggestions(filteredEmojis);
    }
    const suggestionsContainerClassName = style['emoji-intext-suggestion-container'];
    const handleEmojiSuggestionChose = (emoji: Emoji) => {
        //replace the term with the emoji
        const part1 = content.slice(0, currentCursorPosition - 1);
        const part2 = content.slice(currentCursorPosition + emojiSuggestionTerm.length); //ignore the trigger char
        const newContent = part1 + emoji.emoji + part2;
        setContent(newContent);  
        setRevealEmojiSuggestions(false);      
    }
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);

        if(e.target.value.length > 0) {
            setValidContentLength(true);
        }else{
            setValidContentLength(false);
        }
    }
    //reveal emoji suggestions when trigger char is typed
    const handleKeyUpTextArea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === triggerChar) {
            setCurrentCursorPosition(e.currentTarget.selectionStart || 0);
            setRevealEmojiSuggestions(true);
        }
        //get the class of the current top suggestion box who is the immediate sibling of this text box arget, then calculate the height of the suggestion box so we can always put the box at bottom as the text box change height
        if(revealEmojiSuggestions){
            const topSuggestion = e.currentTarget.nextElementSibling?.nextElementSibling as HTMLDivElement;
            const hiddenInput = e.currentTarget.nextElementSibling as HTMLInputElement;
            if(topSuggestion.classList.contains(style['top-suggestion'])&& hiddenInput){
                const topSuggestionHeight = topSuggestion.getBoundingClientRect().height;
                const topSuggestionMaxHeight = parseFloat(window.getComputedStyle(topSuggestion).maxHeight);
                const lineHeight = parseFloat(window.getComputedStyle(e.currentTarget).lineHeight);
                topSuggestion.style.marginTop = `${lineHeight + topSuggestionMaxHeight - topSuggestionHeight}px`;
            } 
        }
    
    }
    //stop revealing when backspace is pressed and the trigger char is deleted
    const handleKeyDownTextArea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === "Enter" || e.key === "Tab"){
            if(revealEmojiSuggestions){
                e.preventDefault();
                const emoji = suggestions[0];
                handleEmojiSuggestionChose(emoji);
            }
        }        
        if (e.key === "Backspace") {
            
            if(emojiSuggestionTerm.length > 0){
                setEmojiSuggestionTerm(prev => prev.slice(0, -1));
            }

            const currentContent = contentTextAreaRef.current?.value;
            const currentCursorPosition = e.currentTarget.selectionStart || 0;
            const currentChar = currentContent?.[currentCursorPosition - 1];
            if(currentChar === triggerChar) {
                setRevealEmojiSuggestions(false);
            }
        }
        if(checkIfPrintableKey(e)){
            if(e.key === triggerChar ) {
                setEmojiSuggestionTerm('');
            }else{
                setEmojiSuggestionTerm(prev => prev + e.key);
            }
        }

    }
    //when form is in preview mode, the textarea will have a max height, so we need to set the overflow-y to scroll when the content is too long
    const handleOnInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
            const target = e.target as HTMLElement;
            target.style.height = 'auto';
            target.style.height = (target.scrollHeight) + 'px';
            if(!preview && forPost){
                const thisForm = target.parentElement?.parentElement as HTMLDivElement;
                const thisPost = thisForm.parentElement?.parentElement as HTMLDivElement;
                const maxHeight = parseFloat(window.getComputedStyle(thisForm).maxHeight);
                const targetHeight = parseFloat(window.getComputedStyle(target).height);
                const postHeight = parseFloat(window.getComputedStyle(thisPost).height);
                if(targetHeight >= maxHeight){
                    thisForm.style.overflowY = 'scroll';
                }else{
                    thisForm.style.overflowY = 'visible';
                }
            }
    }
    /******************END EMOJI SUGGESTIONS SECTION*******************/
    const checkIfPrintableKey = (event: React.KeyboardEvent) => {
        return (/^.$/u.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey);
    }
    const handlePictureInptChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const reader = new FileReader();
        if(file) {
            if(!file.type.startsWith('image')) {
                addToErrorMessages({
                    message: 'File must be an image',
                    type: 'picture-attachment'
                });
            }else{
                if(errorMessages.some(message => message.type.includes('picture'))) {
                    removeFromErrorMessages('picture');
                }
                setPicture(file);
                const imageURL = await URL.createObjectURL(file)
                setPreviewPictureURL(imageURL);

                setPictureAttached(true);
                reader.onerror = () => {
                    addToErrorMessages({
                        message: 'Error reading file',
                        type: 'picture-reading'
                    });
                }

            }
        }
    }
    const handleRemovePictureAttachment = () => {
        setPictureAttached(false);
        setPreviewPictureURL('');
        setPicture(undefined);
        setPreviewRatio(0);
        setPreviewPictureDimensions([0,0]);
        let fileInput = document.getElementById(_id + (preview?"preview" : "")) as HTMLInputElement;
        if(fileInput) {
            fileInput.value = '';
        }
    }
    const handleFormStateTransfer = (state: CommentFormState) => {
        //use the comment form state from modal to update state of this form
        setContent(state.content);
        setPicture(state.picture);
        setPictureAttached(state.pictureAttached);
        setPreviewPictureURL(state.previewPictureURL);
        setPreviewRatio(state.previewRatio);
        setPreviewPictureDimensions(state.previewPictureDimensions);
        setErrorMessages(state.errorMessages);
        setValidContentLength(state.validContentLength);
        setCurrentCursorPosition(state.currentCursorPosition);
        setSuggestions(state.suggestions);
        setRevealEmojiSuggestions(state.revealEmojiSuggestions);
        setEmojiSuggestionTerm(state.emojiSuggestionTerm);
    }
    const addToErrorMessages = (message: ErrorMessage) => {
        setErrorMessages(prev => [...prev, message]);
    }
    const removeFromErrorMessages = (type: string) => {
        setErrorMessages(prev => prev.filter(message => !message.type.includes(type)));
    }
    const handleEmojiSelect = (emoji: string) => {
        setContent(prev => prev + emoji);
    }
    const handleResetForm = () => {
        setContent('');
        handleRemovePictureAttachment();

        if(contentTextAreaRef.current){
            contentTextAreaRef.current.style.height = 'auto';
        }
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setIsSending(true);
        let picuterUrl;
        if(picture && pictureAttached) {
            removeFromErrorMessages('picture')
            const pathToUploadFile = 'upload';
            try{
                const data = await uploadFileToPostAPI(pathToUploadFile,picture);
                picuterUrl = data.url;
            }catch(error) {
                addToErrorMessages({
                    type: "picture-upload",
                    message: 'Error uploading file',
                })
                setIsSending(false);
            }
        }
        let level;
        if(targetLevel === undefined || targetLevel === null) {
            level = 0;
        }else {
            level = targetLevel + 1;
        }
        //posting comment
        const pathToPostCommentAPI = 'comments';
        let comment:Comment = {
            content,
            username,
            targetId,
            createdDate: new Date(),
            updatedDate: new Date(),
            targetType,
            level,
            pictureAttached,
            postId,
        }
        //post comment first, then get the comment id, then post picture
        try{
            removeFromErrorMessages('comment');
            let commentId;
            const reponse = await insertToPostAPI(pathToPostCommentAPI, comment);
            if(reponse.success){
                let mongoPicture: Picture;
                commentId = reponse.data.id;
                comment._id = commentId;
                if(picture && pictureAttached) {
                    
                    const pathToPostPictureAPI = 'pictures/post-picture';
                    mongoPicture = {
                        picturePath: picuterUrl,
                        createdDate: new Date(),
                        targetId: commentId,
                        targetType: 'comment',
                        username,
                        ratio: previewRatio,
                        width: previewPictureDimensions[0],
                        height: previewPictureDimensions[1],
                    }
                    try{
                        await insertToPostAPI(pathToPostPictureAPI, mongoPicture);
                    }catch(err) {
                        addToErrorMessages({
                            type: 'picture-posting',
                            message: 'Error posting picture',
                        })
                    }
                }

                optimisticCommentInsertion(comment)
                setIsCommenting(false);
                handleResetForm();

            }else {
                addToErrorMessages({
                    type: 'comment-posting',
                    message: 'Error posting comment',
                })
            }
            setIsSending(false); 
        } catch (err){
            addToErrorMessages({
                type: 'comment-posting',
                message: 'Error posting comment',
            })
            setIsSending(false);
        }
        //adding picture to post if picture is attached

    }
    const handleSetCommentFormState = () => {//copy local state to context state
        setCommentFormState({content, picture, pictureAttached, previewPictureURL, previewRatio, previewPictureDimensions, errorMessages, validContentLength, currentCursorPosition, suggestions, revealEmojiSuggestions, emojiSuggestionTerm});
    }
    useEffect(()=>{
        handleEmojiSuggestionFilter(emojiSuggestionTerm);
    }, [emojiSuggestionTerm])
    useEffect(()=>{
        if(errorMessages.length > 0){
            setIsSending(false);
        }
    }, [errorMessages])
    useEffect(()=>{
        if(isCommenting && preview){
            contentTextAreaRef.current?.focus();
            if(commentFormRef.current){
                scrollToCommentForm(commentFormRef)
            }
        }
    },[isCommenting])
    useEffect(()=>{
        if(previewPictureURL && previewPictureURL.length){
            const img = new Image();
            img.src = previewPictureURL;
            img.onload = () => {
                setPreviewPictureDimensions([img.width, img.height]);
                setPreviewRatio(img.width / img.height);
            }
        }
    },[previewPictureURL])
    
    //now need to update the comment form state in the context when moving away from this form
    
    useEffect(()=>{        
        if(forPost){ 
           if(postId === curPostId){
                if(show === preview){
                    //moving away from this form
                    handleSetCommentFormState();
                } 
           }
        }
    },[show])
    useEffect(()=>{
        if(commentFormState && postId === curPostId){
            handleFormStateTransfer({...commentFormState});
          
        }
    },[commentFormState])
    useEffect(()=>{
        if(!preview && forPost){
            const observedElement = document.querySelector('#post-form-'+postId+ "."+style['modal'] +" ." + style['text-box']) as HTMLDivElement;
            if(observedElement){
                const resizeObserver = new ResizeObserver(entries => {
                    for(const entry of entries){
                        if(entry){
                            const height = entry.contentRect.height;
                            const maxHeight = parseFloat(window.getComputedStyle(observedElement).maxHeight);
                            if(height >= maxHeight){
                                observedElement.style.overflowY = 'scroll';
                            }else{
                                observedElement.style.overflowY = 'visible';
                            }
                        }
                    }
                });
                resizeObserver.observe(observedElement);
                return () => {
                    resizeObserver.unobserve(observedElement);
                }
            }
        }
    },[])
    return(
        //comment form in preview mode will have overflow-y set to visible, but somehow the suggestion box is over lapped by the next element (feed)
        <div ref={commentFormRef} id={"post-form-" + postId} className={`${style['comment-form']} ${isCommenting ? style['is-commenting'] : ""} ${targetType === 'comments' ? style['comment'] : ''} ${isSending && style['sending']} ${preview ? style['preview'] : style["modal"]}`}>
            <MiniAvatar className={style['comment-form__profile-picture']} username={username} profilePicturePath={userProfilePicturePath} size="medium"/>
            <div className={style['text-box']}>
                <textarea 
                    className={style['comment-form__content']} 
                    placeholder="Write a comment..." 
                    value={content} 
                    onChange={handleContentChange}
                    onKeyUp={handleKeyUpTextArea}
                    onKeyDown={handleKeyDownTextArea}
                    ref={contentTextAreaRef}
                    rows={1}
                    style={{
                      overflow: 'hidden',
                    }}
                    onInput={handleOnInput}
                ></textarea>
                {revealEmojiSuggestions && <IntextSuggestion<Emoji>
                    reveal={revealEmojiSuggestions}
                    setReveal={setRevealEmojiSuggestions}
                    triggerChar={triggerChar}
                    content={content}
                    suggestions={suggestions}
                    suggestionJSX={renderSuggestion}
                    inputRef={contentTextAreaRef}
                    term={emojiSuggestionTerm}
                    handleSuggestionChose={handleEmojiSuggestionChose}
                    suggestionContainerClassName={suggestionsContainerClassName}
                    topSuggestionClassName={style['top-suggestion']}
                    scrollListRef={parentListRef}
                    noAlternate={forPost}
                />}
                {previewRatio && previewPictureURL ? <div 
                    style={{
                        width: `${200 * previewRatio}px`,
                        height: `${200}px`,
                    }}
                    className={style['preview-attachment-picture']}>
                    <NextImage width={previewPictureDimensions[0]} height={previewPictureDimensions[1]} alt="Preview Attachment Picture" src={previewPictureURL} />
                    <button 
                        title="Remove Picture"
                        onClick={()=>{handleRemovePictureAttachment()}}
                        className={style['remove-attachment-btn']}>
                        <IoClose />
                    </button>
                </div> : null}               
                <div className={style['error-display']}>
                    {errorMessages.map((message, index) => 
                        <div key={index} className={style['error-message']}>
                            {message.message}
                        </div>
                    )}
                </div>
                <div className={style['control-group']}>
                    <div className={style['attachment-group']}>
                        <div className={style['picture-attachment']}>
                            <label title="Attach a picture" htmlFor={_id + (preview?"preview" : "")} className={style['control-btn']}>
                                <IoCamera className={style['control-icon'] + " icon"}/>
                            </label>
                            <input type="file" accept="image/*" id={_id + (preview?"preview" : "") } className={style['image-attachment__input'] + " hidden"} onChange={handlePictureInptChange}/>
                        </div> 
                        <EmojiSelector size={targetType === "comments" ? "small" : undefined} containerRef={parentListRef} buttonClassName={style['control-btn']} handleEmojiSelect={handleEmojiSelect} noAlternate={forPost}/>
                    </div>
                    <button  onClick={handleSubmit} title="Send" className={style['send-btn'] + " " + style['control-btn'] + " " + (
                        isSending || !validContentLength ? style['disabled'] : ''
                    )}>
                        <IoSend 
                            className={style['control-icon'] + " icon"}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

