import "./ReactionBar.css";
import ReactionButton from "./ReactionButton";
import AngryIcon from "../../../../images/angry.svg";
import AngryBWIcon from "../../../../images/angryBW.svg";
import CryIcon from "../../../../images/cry.svg";
import CryBWIcon from "../../../../images/cryBW.svg";
import HeartIcon from "../../../../images/heart.svg";
import HeartBWIcon from "../../../../images/heartBW.svg";
import LaughIcon from "../../../../images/laugh.svg";
import LaughBWIcon from "../../../../images/laughBW.svg";
import LikeIcon from "../../../../images/like.svg";
// import LikeBWIcon from "../../../../images/likeBW.svg";
import SurpriseIcon from "../../../../images/surprise.svg";
import SurpriseBWIcon from "../../../../images/surpriseBW.svg";
import { useState } from "react";

type ReactionBarProps = {
  reactions: string[][];
};

function ReactionBar(props: ReactionBarProps) {
  const [likeCount, setLikeCount] = useState(props.reactions[0].length);
  const [heartCount, setHeartCount] = useState(props.reactions[1].length);
  const [laughCount, setLaughCount] = useState(props.reactions[2].length);
  const [cryCount, setCryCount] = useState(props.reactions[3].length);
  const [angryCount, setAngryCount] = useState(props.reactions[4].length);
  const [surpriseCount, setSurpriseCount] = useState(props.reactions[5].length);
  const [showIcons, setShowIcons] = useState(false);
  const [nonZeroOrder, setNonZeroOrder] = useState(["like"]);
  const [zeroOrder, setZeroOrder] = useState([
    "heart",
    "laugh",
    "cry",
    "angry",
    "surprise",
  ]);

  const [nonZeroOrderDisplay, setNonZeroOrderDisplay] = useState(["like"]);
  const [zeroOrderDisplay, setZeroOrderDisplay] = useState([
    "heart",
    "laugh",
    "cry",
    "angry",
    "surprise",
  ]);

  const buttons = [];

  const showAll = () => {
    setShowIcons(true);
  };

  const hideAll = () => {
    setShowIcons(false);
    setNonZeroOrderDisplay(nonZeroOrder);
    setZeroOrderDisplay(zeroOrder);
  };

  if (heartCount > 0 && !nonZeroOrder.includes("heart")) {
    setNonZeroOrder([...nonZeroOrder, "heart"]);
    setZeroOrder(zeroOrder.filter((x) => x !== "heart"));
  }
  if (laughCount > 0 && !nonZeroOrder.includes("laugh")) {
    setNonZeroOrder([...nonZeroOrder, "laugh"]);
    setZeroOrder(zeroOrder.filter((x) => x !== "laugh"));
  }
  if (cryCount > 0 && !nonZeroOrder.includes("cry")) {
    setNonZeroOrder([...nonZeroOrder, "cry"]);
    setZeroOrder(zeroOrder.filter((x) => x !== "cry"));
  }
  if (angryCount > 0 && !nonZeroOrder.includes("angry")) {
    setNonZeroOrder([...nonZeroOrder, "angry"]);
    setZeroOrder(zeroOrder.filter((x) => x !== "angry"));
  }
  if (surpriseCount > 0 && !nonZeroOrder.includes("surprise")) {
    setNonZeroOrder([...nonZeroOrder, "surprise"]);
    setZeroOrder(zeroOrder.filter((x) => x !== "surprise"));
  }
  if (likeCount > 0 && !nonZeroOrder.includes("like")) {
    setNonZeroOrder([...nonZeroOrder, "like"]);
    setZeroOrder(zeroOrder.filter((x) => x !== "like"));
  }

  for (let i = 0; i < nonZeroOrderDisplay.length; i++) {
    if (nonZeroOrderDisplay[i] === "like") {
      buttons.push(
        <ReactionButton
          image={!likeCount ? LikeIcon : LikeIcon}
          count={likeCount}
          showIcons={true}
          countSetter={setLikeCount}
        ></ReactionButton>
      );
    } else if (nonZeroOrderDisplay[i] === "heart") {
      buttons.push(
        <ReactionButton
          image={!heartCount ? HeartBWIcon : HeartIcon}
          count={heartCount}
          showIcons={showIcons}
          countSetter={setHeartCount}
        ></ReactionButton>
      );
    } else if (nonZeroOrderDisplay[i] === "laugh") {
      buttons.push(
        <ReactionButton
          image={!laughCount ? LaughBWIcon : LaughIcon}
          count={laughCount}
          showIcons={showIcons}
          countSetter={setLaughCount}
        ></ReactionButton>
      );
    } else if (nonZeroOrderDisplay[i] === "cry") {
      buttons.push(
        <ReactionButton
          image={!cryCount ? CryBWIcon : CryIcon}
          count={cryCount}
          showIcons={showIcons}
          countSetter={setCryCount}
        ></ReactionButton>
      );
    } else if (nonZeroOrderDisplay[i] === "angry") {
      buttons.push(
        <ReactionButton
          image={!angryCount ? AngryBWIcon : AngryIcon}
          count={angryCount}
          showIcons={showIcons}
          countSetter={setAngryCount}
        ></ReactionButton>
      );
    } else if (nonZeroOrderDisplay[i] === "surprise") {
      buttons.push(
        <ReactionButton
          image={!surpriseCount ? SurpriseBWIcon : SurpriseIcon}
          count={surpriseCount}
          showIcons={showIcons}
          countSetter={setSurpriseCount}
        ></ReactionButton>
      );
    }
  }

  for (let i = 0; i < zeroOrderDisplay.length; i++) {
    if (zeroOrderDisplay[i] === "heart") {
      buttons.push(
        <ReactionButton
          image={!heartCount ? HeartBWIcon : HeartIcon}
          count={heartCount}
          showIcons={showIcons}
          countSetter={setHeartCount}
        ></ReactionButton>
      );
    } else if (zeroOrderDisplay[i] === "laugh") {
      buttons.push(
        <ReactionButton
          image={!laughCount ? LaughBWIcon : LaughIcon}
          count={laughCount}
          showIcons={showIcons}
          countSetter={setLaughCount}
        ></ReactionButton>
      );
    } else if (zeroOrderDisplay[i] === "cry") {
      buttons.push(
        <ReactionButton
          image={!cryCount ? CryBWIcon : CryIcon}
          count={cryCount}
          showIcons={showIcons}
          countSetter={setCryCount}
        ></ReactionButton>
      );
    } else if (zeroOrderDisplay[i] === "angry") {
      buttons.push(
        <ReactionButton
          image={!angryCount ? AngryBWIcon : AngryIcon}
          count={angryCount}
          showIcons={showIcons}
          countSetter={setAngryCount}
        ></ReactionButton>
      );
    } else if (zeroOrderDisplay[i] === "surprise") {
      buttons.push(
        <ReactionButton
          image={!surpriseCount ? SurpriseBWIcon : SurpriseIcon}
          count={surpriseCount}
          showIcons={showIcons}
          countSetter={setSurpriseCount}
        ></ReactionButton>
      );
    }
  }

  return (
    <div className="ReactionBar" onMouseOver={showAll} onMouseLeave={hideAll}>
      {buttons}
    </div>
  );
}

export default ReactionBar;
