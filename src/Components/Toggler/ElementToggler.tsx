import { SetStateAction } from "react";

interface Props {
	show: boolean;
	setShow: React.Dispatch<SetStateAction<boolean>> | null;
	count?: number | null;
	title?: string | null;
}

const ElementToggler = ({
	show,
	setShow,
	count = null,
	title = null,
}: Props) => {
	return (
		<button
			className="element-toggler sub-head"
			onClick={() => {
				show && setShow ? setShow(!show) : null;
			}}
		>
			<div className="elements_info">
				<span className="count">{count}</span>
				<span>{title}</span>
			</div>
			<div className="chevron-right">{">"}</div>
		</button>
	);
};

export default ElementToggler;
