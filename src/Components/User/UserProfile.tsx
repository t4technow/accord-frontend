import { formatDate } from "@/Helper/FormatDate"
import { RootState, User } from "@/lib/Types"
import { blockUser, unBlockUser } from "@/services/apiPOST";
import { getRandomColor } from "@/utils/colorGenerator"
import { SetStateAction, useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  currentUser: User | null;
  color?: string | null;
  setShowProfile?: React.Dispatch<SetStateAction<boolean>>
}
const UserProfile = ({ currentUser, color = null, setShowProfile }: Props) => {
  const loggedUserId = useSelector((state: RootState) => state.user.userId);

  let randomColor = '';
  if (!color) randomColor = getRandomColor()

  const [isBlocked, setIsBlocked] = useState<boolean>(currentUser?.is_blocked || false);

  const handleBlock = async () => {
    if (isBlocked) {
      setIsBlocked(false)
      await unBlockUser(currentUser?.username as string)
    } else {
      setIsBlocked(true)
      await blockUser(currentUser?.username as string)
    }

  }

  return (
    <div className="user-profile" style={{ boxShadow: `${color ? color : randomColor}54 0px 7px 29px 0px` }}>
      <div className="user-image-holder">
        <button
          className="close-modal"
          role="button"
          onClick={() => {
            setShowProfile && setShowProfile(false)
          }}
        >
          <svg
            aria-hidden="true"
            role="img"
            className="closeIcon-pSJDFz"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="#80848e"
              d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"
            ></path>
          </svg>
        </button>
        <div className="user-cover">
          {currentUser?.profile?.cover ? (
            <img
              className="user-cover-photo"
              src={currentUser?.profile?.cover || ""}
              alt=""
            />
          ) : (
            <div className="user-cover-photo" style={{ backgroundColor: color ? color : randomColor }}></div>
          )}
          <div className="user-meta m-1 mt-0">
            {currentUser?.profile?.avatar ? (
              <img
                src={(currentUser && currentUser?.profile?.avatar) || ""}
                alt=""
                className="user-profile avatar"
              />
            ) : (
              <div className="user-profile avatar name" style={{ backgroundColor: color ? color : randomColor }}>
                <span className="head">
                  {currentUser?.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {
              currentUser?.id != loggedUserId &&
              <span className={isBlocked ? 'hash blocked' : 'hash'} onClick={handleBlock}>{isBlocked ? 'Unblock' : 'Block'}</span>
            }
          </div>
        </div>
      </div>
      <div className="user-details m-1 mt-0">
        <h3 className="username">{currentUser ? currentUser.username : ""}</h3>
        <h4 className="user-email">{currentUser ? currentUser.email : ""}</h4>

        <div className="divider"></div>

        <h4 className="member-since sub-head">Accord member since</h4>
        <h6 className="member-since_sub sub">
          {currentUser ? formatDate(currentUser.date_joined) : ""}
        </h6>
      </div>
    </div>
  )
}

export default UserProfile