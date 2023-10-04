import { PictureModalProvider } from "../embedded-view-components/picture-component/PictureModalContext";
import PictureModal from "../embedded-view-components/picture-component/picture-modal/PictureModal";
import { ModalProvider } from "../modal/ModalContext";
interface AllModalProviderProps {
    children: React.ReactNode;
}
export default function AllModalProvider(props: AllModalProviderProps){
    const {children} = props;
    return (
        <PictureModalProvider>
            <ModalProvider>
                    {children}
                    <PictureModal/>
            </ModalProvider>
        </PictureModalProvider>
    )
}