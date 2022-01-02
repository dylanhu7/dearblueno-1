import "./ThreadCollapser.css";
import { useRef } from "react";

type ThreadCollapserProps = {
  collapse: () => void;
};

function ThreadCollapser(props: ThreadCollapserProps) {
  const line = useRef<HTMLDivElement>(null);

  return (
    <div className="ThreadCollapser">
      <div
        className="ThreadCollapserClickable"
        onClick={() => props.collapse()}
        onMouseEnter={() =>
          line.current?.classList.add("ThreadCollapserLineHover")
        }
        onMouseLeave={() =>
          line.current?.classList.remove("ThreadCollapserLineHover")
        }
      >
        <div className="ThreadCollapserLine" ref={line}></div>
      </div>
    </div>
  );
}

export default ThreadCollapser;
