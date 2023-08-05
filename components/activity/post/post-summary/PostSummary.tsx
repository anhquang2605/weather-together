import style from './post-summary.module.css'
interface PostSummaryProps {
    children?: React.ReactNode;
}
export default function PostSummary(props: PostSummaryProps){
    return (
        <div className={style["post-summary"]}>
            {props.children}
        </div>
    )
}