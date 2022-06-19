import styles from "./Post.module.scss";
import ContentWarning from "./ContentWarning";
import RelativeDate from "./RelativeDate";
import PostNumber from "./content/PostNumber";
import ReactionBar from "./reactions/ReactionBar";
import DividerDot from "./content/DividerDot";
import CommentButton from "./comments/CommentButton";
import CommentSection from "./comments/CommentSection";
import { useState } from "react";
import ApproveOrDeny from "./moderator/ApproveOrDeny";
import {
  approvePost,
  bookmarkPost,
  subscribeToPost,
} from "gateways/PostGateway";
import ShareButton from "./ShareButton";
import IPost from "types/IPost";
import LoginPopup from "./LoginPopup";
import { RiShieldCheckFill } from "react-icons/ri";
import {
  MdBookmarkBorder,
  MdBookmark,
  MdNotificationsNone,
  MdNotificationsActive,
} from "react-icons/md";
import UserContent from "./content/UserContent";
import { AiFillPushpin } from "react-icons/ai";
import useUser from "hooks/useUser";

export type PostProps = {
  post: IPost;
  delay?: string;
  skipAnimation?: boolean;
  setFeed?: React.Dispatch<React.SetStateAction<IPost[]>>;
};

function Post(props: PostProps) {
  const { user, refetchUser } = useUser();
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [blurred, setBlurred] = useState(props.post.contentWarning.length > 0);
  const [isBookmarked, setIsBookmarked] = useState(
    user?.bookmarks.includes(props.post._id)
  );
  const [isSubscribed, setIsSubscribed] = useState(
    user?.subscriptions.includes(props.post._id)
  );
  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const approveOrDeny = async (bool: boolean, contentWarningString: string) => {
    const response = await approvePost(
      props.post._id,
      bool,
      contentWarningString
    );
    if (response.success && props.setFeed) {
      props.setFeed((posts) => posts.filter((p) => p._id !== props.post._id));
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribed((subscribed) => !subscribed);
    const response = await subscribeToPost(
      props.post.postNumber,
      !isSubscribed
    );
    if (response.success) {
      refetchUser();
    } else {
      setIsSubscribed(!isSubscribed);
    }
  };

  const handleBookmark = async () => {
    setIsBookmarked((bookmarked) => !bookmarked);
    const response = await bookmarkPost(props.post.postNumber, !isBookmarked);
    if (response.success) {
      refetchUser();
    } else {
      setIsBookmarked((bookmarked) => !bookmarked);
    }
  };

  return (
    <div
      className={styles.DearBluenoCard}
      style={{
        animationDelay: props.delay ?? "0",
        // animation: props.skipAnimation ? "none" : undefined,
        opacity: props.skipAnimation ? 1 : undefined,
      }}
    >
      <LoginPopup showPopup={showPopup} closePopup={closePopup} />
      <div className={styles.PostHeader}>
        <div className={styles.NumberAndWarning}>
          <PostNumber
            number={props.post.postNumber}
            _id={props.post.needsReview ? props.post._id : undefined}
            post={props.post}
          />
          {props.post.verifiedBrown && (
            <RiShieldCheckFill
              className={styles.VerifiedBrown}
              title="Verified Brown"
            />
          )}
          {props.post.contentWarning && (
            <ContentWarning ContentWarningText={props.post.contentWarning} />
          )}
          {props.post.pinned && (
            <AiFillPushpin className={styles.Pinned} title="Pinned Post" />
          )}
        </div>
        <div className={styles.PostHeaderRight}>
          {isSubscribed ? (
            <MdNotificationsActive
              size="1.2rem"
              fill="#1976d2"
              className={styles.PostHeaderButton}
              title="Click to unsubscribe"
              onClick={handleSubscribe}
            />
          ) : (
            <MdNotificationsNone
              size="1.2rem"
              color="#888"
              className={styles.PostHeaderButton}
              title="Click to subscribe"
              onClick={handleSubscribe}
            />
          )}
          {isBookmarked ? (
            <MdBookmark
              size="1.2rem"
              fill="#4caf50"
              className={styles.PostHeaderButton}
              title="Click to remove bookmark"
              onClick={handleBookmark}
            />
          ) : (
            <MdBookmarkBorder
              size="1.2rem"
              color="#888"
              className={styles.PostHeaderButton}
              title="Click to bookmark"
              onClick={handleBookmark}
            />
          )}
          <RelativeDate
            date={
              props.post.needsReview
                ? props.post.postTime
                : props.post.approvedTime
            }
          />
        </div>
      </div>
      <div className={styles.PostBody}>
        <UserContent blurred={blurred} setBlurred={setBlurred}>
          {props.post.content}
        </UserContent>
      </div>
      {props.post.needsReview ? (
        <ApproveOrDeny
          type="post"
          approve={(contentWarningString: string) =>
            approveOrDeny(true, contentWarningString)
          }
          deny={(contentWarningString: string) => {
            approveOrDeny(false, contentWarningString);
          }}
        />
      ) : (
        <div className={styles.PostFooter}>
          <ReactionBar
            postNumber={props.post.postNumber ?? 0}
            commentNumber={undefined}
            type={"post"}
            reactions={props.post.reactions}
          />
          <DividerDot />
          <CommentButton
            type="comment"
            click={user ? () => setShowCommentBox(true) : openPopup}
          />
          <DividerDot />
          <ShareButton postNumber={props.post.postNumber} />
        </div>
      )}
      {!props.post.needsReview && (
        <CommentSection
          comments={props.post.comments}
          blurred={blurred}
          setBlurred={setBlurred}
          postNumber={props.post.postNumber ?? 0}
          showTopLevelCommentBox={showCommentBox}
          setShowTopLevelCommentBox={setShowCommentBox}
        />
      )}
    </div>
  );
}

export default Post;
