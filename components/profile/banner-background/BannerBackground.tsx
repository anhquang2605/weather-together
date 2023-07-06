interface BannerBackgroundProps {
    bannerPicturePath: string;
    isEditing: boolean;
}
export default function BannerBackground({ bannerPicturePath, isEditing }: BannerBackgroundProps) {
    return (
        <div className="banner-background w-full absolute top-0 left-0 h-full z-1 flex flex-col p-4">
            <div className="w-full h-full absolute top-0 left-0">
                {bannerPicturePath?.length ? <img className="w-full h-full object-cover absolute top-0" src={bannerPicturePath} /> : <div className="w-full h-full bg-slate-900"></div>}
            </div>
            {isEditing && <button className="action-btn mt-4 relative mt-auto mx-auto">Update banner</button>}
        </div>
    )
}