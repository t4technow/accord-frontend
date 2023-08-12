import { formatDate } from "@/Helper/FormatDate"
import { User } from "@/lib/Types"
import { getRandomColor } from "@/utils/colorGenerator"

interface Props {
  currentUser: User | null;
  color?: string | null;
}
const UserProfile = ({ currentUser, color = null }: Props) => {
  let randomColor = '';
  if (!color) randomColor = getRandomColor()


  return (
    <div className="user-profile" style={{ boxShadow: `${color ? color : randomColor}54 0px 7px 29px 0px` }}>
      <div className="user-image-holder">
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
            <span className="hash"></span>
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