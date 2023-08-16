import './Topbar.css'
const TopbarSkelton = () => {
  return (
    <div className="topbar d-flex">
      <button className="menu-toggler" >
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" /></svg>
      </button>
      <div className="topbar-menu-container d-flex">
        <div className="left-side">

          <ul className="topbar-menu d-flex">
            <li className="channel-list_item  topbar-header">
              <div className="topbar-header d-flex">
                <svg
                  x="0"
                  y="0"
                  className="icon-2xnN2Y"
                  aria-hidden="true"
                  role="img"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" fillRule="evenodd">
                    <path
                      fill="currentColor"
                      fillRule="nonzero"
                      d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z"
                      transform="translate(2 4)"
                    ></path>
                    <path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path>
                  </g>
                </svg>{" "}
                <span className="channel-name">Friends</span>
              </div>
            </li>

            <li className='topbar-item active' >
              Online
            </li>
            <li
              className='topbar-item' >
              All
            </li>
            <li
              className='topbar-item'>
              Pending
              <span className="count">9</span>
            </li>
            <li
              className='topbar-item' >
              Suggestion
            </li>
            <li
              className='topbar-item' >
              Blocked
            </li>
          </ul>

        </div>
        <div className="right-side">
          <ul className="action-menu">

            <>
              <li className="action-item" >
                <div className="icon">
                  <svg
                    x="0"
                    y="0"
                    className="icon-2xnN2Y"
                    aria-hidden="true"
                    role="img"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M20.998 0V3H23.998V5H20.998V8H18.998V5H15.998V3H18.998V0H20.998ZM2.99805 20V24L8.33205 20H14.998C16.102 20 16.998 19.103 16.998 18V9C16.998 7.896 16.102 7 14.998 7H1.99805C0.894047 7 -0.00195312 7.896 -0.00195312 9V18C-0.00195312 19.103 0.894047 20 1.99805 20H2.99805Z"
                    ></path>
                  </svg>
                </div>

                <p className="hidden-title">create new group</p>
              </li>
            </>

          </ul>
        </div>
      </div>
    </div>
  )
}

export default TopbarSkelton