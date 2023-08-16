import './ChannelsListSkelton.css'

const ChannelSkelton = () => {
  return (
    <div className="secondary-sidebar">
      <div className="secondary-sidebar_header">
        <button className="search-toggler">Find or start a conversation</button>
      </div>

      <nav className="channel-list">

        <li
          className="skelton-list_item active"
        >
          <div className="channel-head" >
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
            </svg>
          </div>
          <span className="channel-name">Friends</span>

        </li>

        <li className="skelton-list_item">
          <div className='online-indicator online'></div>
          <div className="skelton-avatar" ></div>
          <span className="skeleton skeleton-text"></span>
        </li>
        <li className="skelton-list_item">
          <div className='online-indicator online'></div>
          <div className="skelton-avatar" ></div>
          <span className="skeleton skeleton-text"></span>
        </li>
        <li className="skelton-list_item">
          <div className='online-indicator online'></div>
          <div className="skelton-avatar" ></div>
          <span className="skeleton skeleton-text"></span>
        </li>
        <li className="skelton-list_item">
          <div className='online-indicator online'></div>
          <div className="skelton-avatar" ></div>
          <span className="skeleton skeleton-text"></span>
        </li>
        <li className="skelton-list_item">
          <div className='online-indicator online'></div>
          <div className="skelton-avatar" ></div>
          <span className="skeleton skeleton-text"></span>
        </li>
      </nav>

      <div className="user-section_skelton">
        <div className="user-detail">
          <li
            className="skelton-list_item" >
            <div className="skelton-meta" >

              <div className='online-indicator online'></div>

              <div className="skelton-avatar">
              </div>

              <span className="skeleton skeleton-text"></span>

            </div>
            <div className="settings-icon">

              <div className="icon-wrapper" >
                <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M580.231-63.079q-23.461 0-39.423-16.153-15.961-16.154-15.961-39.231v-258.46q0-23.077 15.961-39.23 15.962-16.154 39.423-16.154h258.46q23.077 0 39.231 16.154 16.153 16.153 16.153 39.23v258.46q0 23.077-16.153 39.23-16.154 16.154-39.231 16.154h-258.46Zm0-55.384h258.46v-29.692q-23.077-28.692-56.384-45.654-33.308-16.961-72.846-16.961-39.538 0-73.038 16.961-33.5 16.962-56.192 45.654v29.692Zm129.23-129.23q23.077 0 39.231-16.154 16.153-16.153 16.153-39.23 0-23.077-16.153-39.231-16.154-16.153-39.231-16.153-23.461 0-39.423 16.153-15.961 16.154-15.961 39.231t15.961 39.23q15.962 16.154 39.423 16.154ZM480-480Zm-1.154-112.691q-46.692 0-79.691 32.807-33 32.808-33 79.884 0 36.461 19.769 64.461 19.769 27.999 51.23 40.845v-51.845q-11-8.615-18.308-23.73-7.307-15.116-7.307-29.731 0-27.846 19.73-47.577 19.731-19.73 47.577-19.73 16.846 0 31.077 7.423 14.231 7.423 22.846 19.884h50.614q-11.846-32.076-40.153-52.384-28.308-20.307-64.384-20.307Zm-78.153 492.69-18.077-120.231q-20.538-7-44.231-20.346-23.692-13.346-40.846-28.27l-111.846 50.923-79.922-141.306 101.077-74.384q-2-10.539-2.885-23-.885-12.462-.885-23 0-10.154.885-22.616t2.885-24.154l-101.077-74.769 79.922-140.152 111.461 50.154q18.308-14.924 41.231-28.078 22.924-13.154 43.847-19.538l18.461-121.231h158.614l18.077 120.615q22.077 8.154 44.154 20.231 22.077 12.077 39.769 28.001l113.384-50.154 79.538 140.152-104.538 78.077q0 2.384.192 2.346.192-.038.577.731h-44.845q-1-6.231-2-12.154T701-544.307l93.23-69-40-70.847-105.615 45.231q-21.077-23.692-50.846-41.769Q568-698.769 536.461-703l-13.615-111.615h-85.692l-13.231 111.231q-33.23 6.615-61.192 22.653-27.961 16.039-52.115 41.424L205.77-684.154l-40 70.847 92.461 67.846q-4.385 15.846-6.692 32.153-2.308 16.308-2.308 33.693 0 16.615 2.308 32.538 2.307 15.923 6.307 32.154l-92.076 68.23 40 70.847 104.461-44.847q25.231 25.616 57.962 42.347 32.73 16.73 68.961 24.73v153.615h-36.461Z" /></svg>
              </div>
            </div>

          </li>
        </div>
      </div>
    </div>
  )
}

export default ChannelSkelton