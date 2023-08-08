interface Props {
  notification: any;
}

const Notification = ({ notification }: Props) => {



  return (
    <div className="notification">
      <h4 className="title">{notification.title}</h4>
      <p>{notification.content}</p>
    </div>
  )
}

export default Notification