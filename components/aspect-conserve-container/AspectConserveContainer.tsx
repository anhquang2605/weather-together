interface AspectConserveContainerProps {
    heightRatio: number; //% based on width
    className?: string;
    children: React.ReactNode;
}
export default function AspectConserveContainer({ heightRatio, className, children }: AspectConserveContainerProps) {
    return (
        <div className={`aspect-conserve-container relative ${className}`} style={{paddingBottom: `${heightRatio}%`}}>
            <div className="aspect-conserve-container-content absolute top-0 left-0 w-full h-full">
                {children}
            </div>
        </div>
    )
}