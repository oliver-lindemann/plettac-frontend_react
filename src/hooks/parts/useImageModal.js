import { useContext } from "react";
import PartModalContext from '../../app/context/PartModalContext'

const useImageModal = () => useContext(PartModalContext);

export default useImageModal

