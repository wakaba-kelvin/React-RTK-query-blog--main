import { useState } from 'react';
import ReactDOM from 'react-dom';
import { useUpdatePostMutation, useDeletePostMutation } from '../features/posts/postsApi';

const Post = ({ post }) => {
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [isEditing, setIsEditing] = useState(false);
 
  const [updatedPostData, setUpdatedPostData] = useState({
    post_title: post.post_title,
    post_content: post.post_content,
    // Any other fields you might have
  });

  const handleUpdate = () => {
    updatePost({ id: post.id, ...updatedPostData });
    setIsEditing(false); // Close the modal after updating
  };

  const handleDelete = () => {
    deletePost(post.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPostData({
      ...updatedPostData,
      [name]: value,
    });
  };

  return (
    <article className='card' key={post._id}>
      <h3>{post.post_title}</h3>
      <p>{post.post_content.substring(0, 100)}</p>
      <p>Author: {post.author_id}</p>
      <button onClick={() => setIsEditing(true)} disabled={isUpdating}>
        Edit
      </button>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
      {isEditing && (
        <EditPostModal
          post={post}
          updatedPostData={updatedPostData}
          handleChange={handleChange}
          handleUpdate={handleUpdate}
          closeModal={() => setIsEditing(false)}
        />
      )}
    </article>
  );
};

const EditPostModal = ({ post, updatedPostData, handleChange, handleUpdate, closeModal }) => {
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Post</h2>
        <input
          type="text"
          name="post_title"
          value={updatedPostData.post_title}
          onChange={handleChange}
        />
        <textarea
          name="post_content"
          value={updatedPostData.post_content}
          onChange={handleChange}
        />
        <button onClick={handleUpdate}>Update</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Post;
