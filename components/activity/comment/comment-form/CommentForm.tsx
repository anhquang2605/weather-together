
import React,{useState, useEffect, useRef} from 'react'
import { insertToPostAPI, uploadFileToPostAPI } from '../../../../libs/api-interactions';
import style from './comment-form.module.css';
import MiniAvatar from '../../mini-avatar/MiniAvatar';
import {IoCamera,IoSend, IoClose} from 'react-icons/io5';
import EmojiSelector from '../../text-editing/emoji-selections/EmojiSelector';
import IntextSuggestion from '../../text-editing/intext-suggestion/IntextSuggestion';
import { EMOJIS } from '../../../../constants/emojis';
import { Emoji } from '../../../../types/Emoji';
import NextImage from 'next/image';
import { add, set } from 'lodash';
interface ErrorMessage {
    message: string,
    type: string //picture-attachment, content-length
}
interface CommentFormProps {
    targetId: string,//will be "" if comment on post
    username: string,
    targetLevel?: number, //for comment on comment, if none, then the target is a post, whoever call this will have level = target level + 1 but 0 if target is a post
    postId: string,
    isCommenting: boolean,
    setIsCommenting: (isCommenting: boolean) => void,
    userProfilePicturePath: string,
    targetType: string, //posts or comments
}
export default function CommentForm({targetId, username, targetLevel = 0, postId, isCommenting, setIsCommenting, userProfilePicturePath, targetType}: CommentFormProps) {
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [pictureAttached, setPictureAttached] = useState(false);
    const [picture, setPicture] = useState<File>();
    const [previewPictureURL, setPreviewPictureURL] = useState<string | null>('');
    const [previewRatio, setPreviewRatio] = useState<number>(1); //[width, height
    const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([]);
    const [validContentLength, setValidContentLength] = useState(false); //min should be 1 word
    const [s3PictureURL, setS3PictureURL] = useState<string | null>(null);

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
            
                <div title={suggestion.name} className={`${style['emoji-intext-suggestion-item']} ${index === 0 ? style['top-suggestion'] : ""}`} onClick={()=>{handleEmojiSuggestionChose(suggestion)}}>
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
    }
    //stop revealing when backspace is pressed and the trigger char is deleted
    const handleKeyDownTextArea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === "Enter" || e.key === "Tab"){
            if(revealEmojiSuggestions){
                e.preventDefault();
                const emoji = suggestions[0];
                handleEmojiSuggestionChose(emoji);
                setRevealEmojiSuggestions(false);
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
    /******************END EMOJI SUGGESTIONS SECTION*******************/
    const checkIfPrintableKey = (event: React.KeyboardEvent) => {
        return (/^.$/u.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey);
    }
    const handlePictureInptChange = (e:React.ChangeEvent<HTMLInputElement>) => {
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
                const imageURL = URL.createObjectURL(file)
                setPreviewPictureURL(imageURL);
                const newImage = new Image();
                newImage.src = imageURL;
                newImage.onload = () => {
                   setPreviewRatio(newImage.width / newImage.height);
                }
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
        setPreviewPictureURL(null);
        setPicture(undefined);
        setPreviewRatio(1);
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
        setPictureAttached(false);
        setPicture(undefined);
        setPreviewPictureURL(null);
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
            }
        }
        let level;
        if(targetLevel === undefined || targetLevel === null) {
            level = 0;
        }else {
            level = targetLevel + 1;
        }
        //posting comment
        const pathToPostCommentAPI = 'comments/post-comment';
        const comment = {
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
            //commentId = await insertToPostAPI(pathToPostCommentAPI, comment);

            if(picture && pictureAttached && commentId) {
                const pathToPostPictureAPI = 'pictures/post-picture';
                const mongoPicture = {
                    picturePath: picuterUrl,
                    createdDate: new Date(),
                    targetId: commentId,
                    targetType: 'comment',
                    username,
                }
                try{
                    await insertToPostAPI(pathToPostPictureAPI, mongoPicture);
                }catch(err) {0
                    addToErrorMessages({
                        type: 'picture-posting',
                        message: 'Error posting picture',
                    })
                }
            }
            handleResetForm();
            setIsSending(false); 
        } catch (err){
            addToErrorMessages({
                type: 'comment-posting',
                message: 'Error posting comment',
            })
        }
        //adding picture to post if picture is attached

    }
    useEffect(()=>{
        handleEmojiSuggestionFilter(emojiSuggestionTerm);
    }, [emojiSuggestionTerm])
    useEffect(()=>{
        if(errorMessages.length > 0){
            setIsSending(false);
        }
    }, [errorMessages])
    return(
        <div className={style['comment-form']}>
            <MiniAvatar profilePicturePath={userProfilePicturePath} size="large"/>
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
                      resize: 'none',
                    }}
                    onInput={ (e:React.FormEvent<HTMLElement>) => {
                        const target = e.target as HTMLElement;
                        target.style.height = 'auto';
                        target.style.height = (target.scrollHeight) + 'px';
                    }}
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
                />}
                {previewPictureURL && <div className={style['preview-attachment-picture']}>
                    <NextImage width={200 * previewRatio} height={200 / previewRatio} alt="Preview Attachment Picture" src={previewPictureURL} />
                    <button 
                        title="Remove Picture"
                        onClick={()=>{handleRemovePictureAttachment()}}
                        className={style['remove-attachment-btn']}>
                        <IoClose />
                    </button>
                </div>}               
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
                            <label title="Attach a picture" htmlFor="picture-comment-upload" className={style['control-btn']}>
                                <IoCamera className={style['control-icon'] + " icon"}/>
                            </label>
                            <input type="file" accept="image/*" id="picture-comment-upload" className={style['image-attachment__input'] + " hidden"} onChange={handlePictureInptChange}/>
                        </div> 
                        <EmojiSelector buttonClassName={style['control-btn']} handleEmojiSelect={handleEmojiSelect}/>
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

