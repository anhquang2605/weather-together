import style from './content-summary.module.css'
interface ContentSummaryProps {
    children?: React.ReactNode;
}
export default function PostSummary(props: ContentSummaryProps){
    return (
        <div className={style["post-summary"]}>
            {props.children}
        </div>
    )
}