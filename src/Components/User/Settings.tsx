import UserProfile from "./UserProfile";

import './Settings.css'
import { SetStateAction } from "react";
import { RootState } from "@/lib/Types";
import { useSelector } from "react-redux";

interface Props {
  setShowSettings: React.Dispatch<SetStateAction<boolean>>
}


const Settings = ({ setShowSettings }: Props) => {
  const user = useSelector((state: RootState) => state.user.loggedUser) || null
  return (
    <div className="modal">
      <div className="content-wrapper">
        <div className="close-btn" onClick={() => setShowSettings(false)}>X</div>
        <UserProfile currentUser={user} />
      </div>
    </div>
  )
}

export default Settings