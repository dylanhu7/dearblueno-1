import "./CommentMenuButton.css";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import IUser from "../../../../../types/IUser";
import { IThread } from "../CommentSection";
import { deleteComment } from "../../../../../gateways/PostGateway";

interface CommentMenuButtonProps {
  user?: IUser;
  commentNumber: number;
  postNumber: number;
  commentUser?: IUser;
  reported: Boolean;
  setComments?: React.Dispatch<React.SetStateAction<IThread[]>>;
}

function CommentMenuButton(props: CommentMenuButtonProps) {
  const [referenceElement, setReferenceElement] = useState<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);
  const [arrowElement, setArrowElement] = useState<any>(null);
  const { styles, attributes } = usePopper<any>(
    referenceElement,
    popperElement,
    {
      placement: "bottom-end",
      modifiers: [
        {
          name: "arrow",
          options: { element: arrowElement },
        },
        {
          name: "offset",
          options: { offset: [8, 8] },
        },
        {
          name: "flip",
          options: {
            allowedAutoPlacements: ["top", "bottom"], // by default, all the placements are allowed
            flipVariations: false,
          },
        },
      ],
    }
  );
  const [clicked, setClicked] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showPopup, setshowPopup] = useState(false);
  const openPopup = () => {
    setshowPopup(true);
    setClicked(false);
  };

  const closePopup = () => setshowPopup(false);

  const [showDeletePopup, setshowDeletePopup] = useState(false);
  const openDeletePopup = () => {
    setshowDeletePopup(true);
  };
  const closeDeletePopup = () => setshowDeletePopup(false);

  let refDropdown = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (refDropdown.current && !refDropdown.current.contains(event.target)) {
      setClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const reportReasons = ["spam", "inappropriate", "other"];

  const popUp = (
    <div className="Popup">
      <DialogOverlay
        style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
        isOpen={showPopup}
        onDismiss={closePopup}
      >
        <DialogContent aria-label="Report Dialog">
          <p>
            <strong>REPORT REASON</strong>
            {reportReasons.map((reason) => (
              <div
                className="ReportReason"
                key={reason}
                onClick={() => {
                  closePopup();
                }}
              >
                {reason}
              </div>
            ))}
          </p>
        </DialogContent>
      </DialogOverlay>
    </div>
  );

  const deletePopUp = (
    <div className="Popup">
      <DialogOverlay
        style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
        isOpen={showDeletePopup}
        onDismiss={closeDeletePopup}
      >
        <DialogContent aria-label="Delete Dialog">
          <p className="DeleteBox">
            <p className="DeleteConfirmationText">
              <strong>ARE YOU SURE?</strong>
            </p>
            <br />
            <div className="DeleteConfirmationOptions">
              <p onClick={closeDeletePopup} className="PopupAction">
                No
              </p>
              <p
                onClick={async () => {
                  closeDeletePopup();

                  const response = await deleteComment(
                    props.postNumber,
                    props.commentNumber
                  );
                  console.log(props.setComments);
                  if (response.success && props.setComments) {
                    props.setComments((comments) => {
                      const newComments = comments;
                      const deletedParent = findParentOfComment(
                        newComments,
                        props.commentNumber
                      );
                      if (deletedParent) {
                        const deleted = deletedParent.children.find(
                          (child) => child.commentNumber === props.commentNumber
                        );
                        if (deleted) {
                          deletedParent.children.splice(
                            deletedParent.children.indexOf(deleted, 1),
                            1
                          );
                        }
                      } else {
                        const deleted = newComments.find(
                          (comment) =>
                            comment.commentNumber === props.commentNumber
                        );
                        if (deleted) {
                          newComments.splice(
                            newComments.indexOf(deleted, 1),
                            1
                          );
                          const deleted = newComments.find(
                            (comment) =>
                              comment.commentNumber === props.commentNumber
                          );
                          if (deleted) {
                            newComments.splice(
                              newComments.indexOf(deleted, 1),
                              1
                            );
                          }
                        }
                      }
                      return newComments;
                    });
                  }
                }}
                className="PopupAction"
              >
                Yes
              </p>
            </div>
          </p>
        </DialogContent>
      </DialogOverlay>
    </div>
  );

  const shareAction = () => {
    navigator.clipboard.writeText(
      "https://dearblueno.net/comment/ + necessary data"
    );
    setCopied(true);
    setTimeout(() => {
      setClicked(false);
      setCopied(false);
    }, 1000);
  };

  const findParentOfComment = (
    comments: IThread[],
    commentNumber: number
  ): IThread | undefined => {
    comments.forEach((comment) => {
      if (comment.children) {
        if (
          comment.children.find(
            (child) => child.commentNumber === commentNumber
          )
        ) {
          return comment;
        } else {
          const parent = findParentOfComment(comment.children, commentNumber);
          if (parent) {
            return parent;
          }
        }
      }
    });
    return undefined;
  };

  return (
    <div className="CommentMenuDropdown" ref={refDropdown}>
      <div className="CommentMenuButton" ref={setReferenceElement}>
        {popUp}
        {deletePopUp}
        <div
          className="CommentMenuDropdownText"
          onClick={() => setClicked(!clicked)}
        >
          •••
        </div>
        {clicked && (
          <div
            className="PopperContainer"
            ref={setPopperElement}
            style={styles.popper}
            role="tooltip"
            {...attributes.popper}
          >
            <div
              className="DropdownArrow"
              ref={setArrowElement}
              style={styles.arrow}
            />
            <div className="MenuDropdownActions">
              {!copied && (
                <>
                  {props.user &&
                  props.commentUser &&
                  props.user._id === props.commentUser._id ? null : (
                    <p className="MenuDropdownAction" onClick={openPopup}>
                      report
                    </p>
                  )}
                  <p className="MenuDropdownAction" onClick={shareAction}>
                    share
                  </p>
                  {props.user &&
                  props.commentUser &&
                  props.user._id === props.commentUser._id ? (
                    <p
                      className="MenuDropdownAction"
                      onClick={() => {
                        openDeletePopup();
                      }}
                    >
                      delete
                    </p>
                  ) : null}
                </>
              )}
              {copied && <p>copied</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentMenuButton;
