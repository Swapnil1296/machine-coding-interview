import React, { useState } from "react";

const initialComments = [
  {
    id: "1",
    text: "This is the first comment",
    author: "John Bonny",
    likes: 2,
    likedByMe: false,
    createdAt: Date.now(),
    showReplies:true,
    replies: [
      {
        id: "2",
        text: "This is a reply",
        author: "Alex",
        likes: 1,
        likedByMe: false,
            createdAt: Date.now(),
        showReplies:false,
        replies: [
          {
            id: "3",
            text: "what's up guy ? how are you all ?",
            author: "John",
            likes: 2,
                likedByMe: false,
            showReplies:false,
            createdAt: Date.now(),
            replies: [
              {
                id: "4",
                text: "I am doing fine John",
                author: "Alex",
                likes: 1,
                likedByMe: false,
                createdAt: Date.now(),
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
    text: "I gonna sleep here.",
    author: "Sam",
    likes: 2,
    likedByMe: false,
      createdAt: Date.now(),
    showReplies:false,
    replies: [],
    // replies: [
    //     {
    //         id: "2",
    //         text: "This is a reply",
    //         author: "Alex",
    //         likes: 1,
    //         likedByMe: false,
    //         createdAt: Date.now(),
    //         replies: [{
    //             id: "3",
    //             text: "This is the first comment",
    //             author: "John",
    //             likes: 2,
    //             likedByMe: false,
    //             createdAt: Date.now(),
    //             replies: [
    //                 {
    //                     id: "4",
    //                     text: "This is a reply",
    //                     author: "Alex",
    //                     likes: 1,
    //                     likedByMe: false,
    //                     createdAt: Date.now(),
    //                     replies: []
    //                 }
    //             ]
    //         }]
    //     }
    // ]
  },
];

const NestedCommentSystem = () => {
    const [comments, setComments] = useState(initialComments);
    const [value,setValue]=useState('')
  return (
    <div className="container">
          <Comments comments={comments} setComments={setComments} value={value} />
      <AddComment setValue={setValue} value={value} />
    </div>
  );
};

const updateComment = (list, id, updater) =>
  list.map((comment) => {
    if (comment.id === id) return updater(comment);
    if (comment.replies?.length) {
      return { ...comment, replies: updateComment(comment.replies, id, updater) };
    }
    return comment;
  });


const Comments = ({ comments, setComments ,value}) => {

 const toggleReplies = (id) => {
  setComments((prev) =>
    updateComment(prev, id, (c) => ({ ...c, showReplies: !c.showReplies }))
  );
    };
    console.log("comments",comments)
    const addComment = (comment,id,user) => {
        setComments((prev) => updateComment(prev, id, (c) => ({
            ...c, replies: [...c.replies, {
             id: crypto.randomUUID(),
    text:comment,
    author: user,
    likes: 2,
    likedByMe: false,
    createdAt: Date.now(),
        }]})))
    }
    console.log("value",value)
if (!comments || comments.length === 0) return null;

  return (
    <div className="comment_container">
      {comments?.length> 0 &&comments?.map((items, index) => {
        const userInitials = items?.author
          ?.split(" ")
          .map((name) => name[0])
          .join("")
          .toUpperCase();
          return (
            <>
            <div className="comments_sections" key={items?.id}>
                
            <div className="user_profile">
              <span>{userInitials}</span>
            </div>
            <div className="user_comment">{items.text}</div>
            <div className="likes_counter">
              <span class="material-symbols-outlined">thumb_up</span>
              <span>{items.likes}</span>
                </div>
               
                  </div>
                  <div className="replies_container">
                      {items?.replies?.length > 0 && <span role="button" className="replies" onClick={() => toggleReplies(items.id)}>...replies</span>}
                  <button type="button" onClick={(e)=>addComment(value,items.id,'swapnil')}>+</button>
                  </div>
                  {items?.replies && items?.showReplies && <Comments comments={items?.replies} setComments={setComments} />}
                  </>
        );
      })}
    </div>
  );
};
const ReplyOnComments = () => {
  return <div></div>;
};

const AddComment = ({setValue,value}) => {
    const handleSubmit = (e) => {
       
      e.preventDefault();
      
  };
  return (
    <div className="add_comment">
      <div className="user_img">
        <span class="material-symbols-outlined">account_circle</span>
      </div>

      <form className="input_form" onSubmit={() => handleSubmit(e)}>
        <textarea
          id="comment"
                  name="comment"
                  value={value}
                  rows={3}
                  onChange={(e)=>setValue(e.target.value)}
          placeholder="Add a comment..."
        >
          {" "}
        </textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default NestedCommentSystem;
