
interface NameTitleProps {
    lastName: string | undefined;
    firstName: string | undefined;
}
export default function NameTitle({lastName, firstName}:NameTitleProps) {
    return (
        <div className="name-title flex flex-col">
            <h1 className="lg:text-3xl md:text-2xl text-xl">{firstName} {lastName}</h1>
        </div>
    )
}