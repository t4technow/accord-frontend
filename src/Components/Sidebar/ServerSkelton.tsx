import './ServerSkelton.css'
const ServerSkelton = () => {
  return (
    // React hooks and types

    <div className="server-list">
      <div className="server-list_item">
        <div className="mention-pill unread"></div>
        <div
          className='server active'
        >
          <img className="server_avatar_skelton" src="/adobe.jpg" alt='direct messages' />
        </div>
      </div>
      <div className="separator"></div>

      <div className="server-list_item">
        <div className="mention-pill unread"></div>
        <div
          className='server'
        >
          <div
            className="server_avatar_skelton"
          ></div>
        </div>
      </div>

      <div className="server-list_item">
        <div className="mention-pill unread"></div>
        <div
          className='server'
        >
          <div
            className="server_avatar_skelton"
          ></div>
        </div>
      </div>

      <div className="server-list_item">
        <div className="mention-pill unread"></div>
        <div
          className='server'
        >
          <div
            className="server_avatar_skelton"
          ></div>
        </div>
      </div>

      <div className="server-list_item">
        <div className="mention-pill unread"></div>
        <div
          className='server'
        >
          <div
            className="server_avatar_skelton"
          ></div>
        </div>
      </div>

      <div
        className="server-list_item"
      >
        <div
          className='server add-server'
        >
          <svg
            className="add"
            aria-hidden="true"
            role="img"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"></path>
          </svg>
        </div>
      </div>
    </div>

  )
}

export default ServerSkelton