
interface NameTitleProps {
    lastName: string | undefined;
    firstName: string | undefined;
}
export default function NameTitle({lastName, firstName}:NameTitleProps) {
    return (
        <div className="name-title">
            <span className="lg:text-3xl md:text-2xl text-xl">{firstName} {lastName}</span>
        </div>
    )
}