import { fuzzyBubbles } from "@/utils/fonts";
import classNames from "classnames";

type SectionHeadingProps = {
    children: React.ReactNode;
    color: string;
};

const SectionHeading: React.FC<SectionHeadingProps> = ({ children, color }) => (
    <h2
        className={classNames("text-6xl font-bold", fuzzyBubbles.className)}
        style={{ color }}
    >
        {children}
    </h2>
);

export default SectionHeading;