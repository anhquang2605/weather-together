import { useEffect, useState } from "react";
import { User } from "../../../../types/User";

interface EditBioProps {
    userBio: string;
    user: User;
    maxBioLength: number;
}
export default function EditBio({ userBio, user, maxBioLength }: EditBioProps) {
    const [bio, setBio] = useState<string>(userBio);
    const [apiStatus, setApiStatus] = useState('');
    const [wordCount, setWordCount] = useState<number>(0);
    const updateUserBio = async () => {
        setApiStatus('updating');
        const response = await fetch(`/api/update-user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...user,
                bio: bio,
            }),
        });
        if (!response.ok) {
            setApiStatus('update-error');
        } else {
            setApiStatus('update-success');
        }
    }

    const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(event.target.value);
        setWordCount(event.target.value.split(" ").length);
    }

    return (
        <div className="bio flex flex-row flex-wrap w-full">
            <div className="bio-content grow w-full">
                <textarea className="w-full text-indigo-900 rounded-md p-2 min-h-[150px]" value={bio} placeholder={userBio === "" ? "Working on it" : ""} onChange={handleBioChange} />
            </div>
            <p className="text-slate-300 text-sm">{wordCount}/{maxBioLength}</p>
            <div className = "flex flex-row w-full mt-4">
                <button onClick={updateUserBio} className="action-btn ">
                    Update bio
                </button>
                <p className="p-4 text-lg">
                    {apiStatus === 'update-success' && <span className="text-green-500">Bio updated successfully</span>}
                    {apiStatus === 'update-error' && <span className="text-red-500">Error updating bio</span>}
                    {apiStatus === '' && <span className="text-transparent">idle </span>}
                </p>            
            </div>

            

            
        </div>
    )
}
