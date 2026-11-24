import { memo, useMemo, useState } from "react";

// There is no login in this app, so every new comment, like and edit
// is done by this one user.
const CURRENT_USER = "You";

// Every comment has the same shape:
// {
//   id:          unique string
//   author:      who wrote it
//   text:        the comment text
//   likedBy:     list of user names who liked it (like count = likedBy.length)
//   isCollapsed: true when its replies are hidden
//   isEdited:    true after the text was changed
//   replies:     list of comments with this same shape (this is the nesting)
// }
const initialComments = [
  {
    id: "1",
    author: "John Bonny",
    text: "This is the first comment",
    likedBy: ["Alex", "Sam"],
    isCollapsed: false,
    isEdited: false,
    replies: [
      {
        id: "2",
        author: "Alex",
        text: "This is a reply",
        likedBy: ["John Bonny"],
        isCollapsed: false,
        isEdited: false,
        replies: [
          {
            id: "3",
            author: "John",
            text: "What's up guys? How are you all?",
            likedBy: [],
            isCollapsed: false,
            isEdited: false,
            replies: [
              {
                id: "4",
                author: "Alex",
                text: "I am doing fine John",
                likedBy: [],
                isCollapsed: false,
                isEdited: false,
                replies: [],
              },
            ],
          },
          {
            id: "6",
            author: "Dash",
            text: "What's up guys? How are you all?",
            likedBy: [],
            isCollapsed: false,
            isEdited: false,
            replies: [
              {
                id: "7",
                author: "Alex",
                text: "I am doing fine Dash",
                likedBy: [],
                isCollapsed: false,
                isEdited: false,
                replies: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "5",
    author: "Sam",
    text: "I am going to sleep here.",
    likedBy: ["Alex"],
    isCollapsed: false,
    isEdited: false,
    replies: [],
  },
];

/* ------------------------------------------------------------------ */
/* Helper functions                                                    */
/* None of them change the old data. They always return NEW arrays and */
/* NEW objects, which is what React needs to see a change.             */
/* ------------------------------------------------------------------ */

// Make a brand new comment. crypto.randomUUID() gives every comment a unique id.
const createComment = (text) => ({
  id: crypto.randomUUID(),
  author: CURRENT_USER,
  text: text,
  likedBy: [],
  isCollapsed: false,
  isEdited: false,
  replies: [],
});

// Find the comment with this id (at any depth) and replace it with
// whatever the `change` function returns. All other comments stay the same.
// const updateComment = (list, id, change) => {
//   return list.map((comment) => {
//     if (comment.id === id) {
//       return change(comment);
//     }
//     // Not this one, so look inside its replies.
//     return { ...comment, replies: updateComment(comment.replies, id, change) };
//   });
// };

// Better version: only the comments on the path to the changed comment are copied.
// Every other comment keeps its OLD object, so React.memo can see "nothing changed"
// (same object as before) and skip re-rendering it.
const updateComment = (list, id, change) => {
  let changed = false;

  const updatedList = list.map((comment) => {
      if (comment.id === id) {
          changed = true;
          return change(comment);
      }

      const updatedReplies = updateComment(comment.replies, id, change);

      if (updatedReplies === comment.replies) {
          return comment;
      }

      changed = true;

      return {
          ...comment,
          replies: updatedReplies
      };
  });

  return changed ? updatedList : list;
};

// Remove the comment with this id (at any depth).
// Its replies are removed with it, because they live inside it.
// Like updateComment, comments that did not change keep their old object.
const removeComment = (list, id) => {
  let changed = false;
  const newList = [];

  for (const comment of list) {
    if (comment.id === id) {
      changed = true; // skip it, so it is not added to the new list
      continue;
    }

    const newReplies = removeComment(comment.replies, id);
    if (newReplies === comment.replies) {
      newList.push(comment); // nothing changed inside, reuse as it is
    } else {
      changed = true;
      newList.push({ ...comment, replies: newReplies });
    }
  }

  return changed ? newList : list;
};

// Count ALL replies under a comment: children, grandchildren, and so on.
const countReplies = (comment) => {
  let total = 0;
  for (const reply of comment.replies) {
    total = total + 1 + countReplies(reply);
  }
  return total;
};

/* ------------------------------------------------------------------ */
/* Main component: owns the data and every action that changes it      */
/* ------------------------------------------------------------------ */

const NestedCommentSystem = () => {
  const [comments, setComments] = useState(initialComments);

  // A. Add a top-level comment. It goes at the START of the list,
  //    so the newest comment is shown first.
  const addComment = (text) => {
    setComments((prev) => [createComment(text), ...prev]);
  };

  // The actions for each Comment are bundled into one `actions` object.
  //
  // useMemo with [] builds this object ONCE and gives back the same object on
  // every render. That matters for React.memo: if `actions` were a new object
  // each render, every Comment would see a "changed" prop and re-render anyway.
  // It is safe to build it once, because the functions only call setComments
  // (which never changes) and use "prev" to get the latest comments.
  const actions = useMemo(
    () => ({
      // B. Add a reply under the parent comment. This works for any depth,
      //    because updateComment can find the parent anywhere in the tree.
      //    We also expand the parent so the new reply is visible.
      addReply: (parentId, text) => {
        setComments((prev) =>
          updateComment(prev, parentId, (parent) => ({
            ...parent,
            isCollapsed: false,
            replies: [...parent.replies, createComment(text)],
          })),
        );
      },

      // C. Change the text of a comment. Its replies are not touched.
      editComment: (id, text) => {
        setComments((prev) =>
          updateComment(prev, id, (comment) => ({
            ...comment,
            text: text,
            isEdited: comment.isEdited || comment.text !== text,
          })),
        );
      },

      // D. Delete a comment and everything under it.
      deleteComment: (id) => {
        setComments((prev) => removeComment(prev, id));
      },

      // E. Like if the user has not liked yet, unlike if they have.
      //    likedBy is a list of names, so one user can never be in it twice.
      toggleLike: (id) => {
        setComments((prev) =>
          updateComment(prev, id, (comment) => {
            const alreadyLiked = comment.likedBy.includes(CURRENT_USER);
            const newLikedBy = alreadyLiked
              ? comment.likedBy.filter((user) => user !== CURRENT_USER)
              : [...comment.likedBy, CURRENT_USER];
            return { ...comment, likedBy: newLikedBy };
          }),
        );
      },

      // F. Hide or show the replies of a comment.
      toggleCollapse: (id) => {
        setComments((prev) =>
          updateComment(prev, id, (comment) => ({
            ...comment,
            isCollapsed: !comment.isCollapsed,
          })),
        );
      },
    }),
    [],
  );

  // Total number of comments, including all replies (for the heading).
  const totalComments = comments.reduce(
    (total, comment) => total + 1 + countReplies(comment),
    0,
  );

  return (
    <div className="comments-app">
      <h2>Comments ({totalComments})</h2>

      <CommentForm
        placeholder="Add a comment..."
        submitLabel="Comment"
        onSubmit={addComment}
      />

      {comments.length === 0 && (
        <p className="comments-empty">No comments yet. Be the first to comment!</p>
      )}

      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} actions={actions} />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* CommentForm: one form used for new comments, replies and edits      */
/* ------------------------------------------------------------------ */

const CommentForm = ({
  onSubmit,
  onCancel,
  initialText = "",
  placeholder,
  submitLabel,
}) => {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the page from reloading

    const trimmedText = text.trim(); // "   " becomes ""
    if (trimmedText === "") {
      setError("Comment cannot be empty.");
      return; // stop here, nothing is saved
    }

    onSubmit(trimmedText);
    setText(""); // clear the box for next time
    setError("");
  };

  const handleChange = (e) => {
    setText(e.target.value);
    setError(""); // hide the error as soon as the user types again
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        rows={3}
      />
      {error && <p className="comment-error">{error}</p>}
      <div className="comment-buttons">
        <button type="submit">{submitLabel}</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Comment: shows one comment and calls itself for each of its replies */
/* ------------------------------------------------------------------ */

// memo() makes React skip re-rendering a Comment when its props (comment and
// actions) are the same as last time. So when you like one comment, only that
// comment and the ones above it on its path re-render, not every comment on the page.
const Comment = memo(({ comment, actions }) => {
  // These only control what THIS comment shows, so they stay in this component.
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isLiked = comment.likedBy.includes(CURRENT_USER);
  const replyCount = countReplies(comment); // children + grandchildren + ...
  const replyWord = replyCount === 1 ? "reply" : "replies";

  const handleDelete = () => {
    // Warn first if other comments will disappear with this one.
    if (replyCount > 0) {
      const ok = window.confirm(
        `This will also delete ${replyCount} ${replyWord}. Delete anyway?`,
      );
      if (!ok) return;
    }
    actions.deleteComment(comment.id);
  };

  return (
    <div className="comment">
      <div className="comment-box">
        <div className="comment-author">
          {comment.author}
          {comment.isEdited && <span className="comment-edited"> (edited)</span>}
        </div>

        {/* Show a form while editing, otherwise show the plain text */}
        {isEditing ? (
          <CommentForm
            initialText={comment.text}
            submitLabel="Save"
            onSubmit={(newText) => {
              actions.editComment(comment.id, newText);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p className="comment-text">{comment.text}</p>
        )}

        <div className="comment-actions">
          <button type="button" onClick={() => actions.toggleLike(comment.id)}>
            {isLiked ? "Unlike" : "Like"} ({comment.likedBy.length})
          </button>
          <button type="button" onClick={() => setIsReplying(!isReplying)}>
            Reply
          </button>
          <button
            type="button"
            disabled={isEditing}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>

          {/* Only comments that have replies get a collapse button */}
          {replyCount > 0 && (
            <button
              type="button"
              onClick={() => actions.toggleCollapse(comment.id)}
            >
              {comment.isCollapsed
                ? `Show ${replyCount} ${replyWord}`
                : "Hide replies"}
            </button>
          )}
        </div>

        {isReplying && (
          <CommentForm
            placeholder={`Reply to ${comment.author}...`}
            submitLabel="Reply"
            onSubmit={(replyText) => {
              actions.addReply(comment.id, replyText);
              setIsReplying(false);
            }}
            onCancel={() => setIsReplying(false)}
          />
        )}
      </div>

      {/* Each reply is a Comment too. A reply can have replies of its own,
          so the nesting can go as deep as you like. */}
      {!comment.isCollapsed && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} actions={actions} />
          ))}
        </div>
      )}
    </div>
  );
});

export default NestedCommentSystem;
