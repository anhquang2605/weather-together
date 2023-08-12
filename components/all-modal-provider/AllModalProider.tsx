import { PictureModalProvider } from "../embedded-view-components/picture-component/PictureModalContext";
import PictureModal from "../embedded-view-components/picture-component/picture-modal/PictureModal";
interface AllModalProviderProps {
    children: React.ReactNode;
}
export default function AllModalProvider(props: AllModalProviderProps){
    const {children} = props;
    return (
        <PictureModalProvider>
            {children}
            <PictureModal/>
        </PictureModalProvider>
    )
}