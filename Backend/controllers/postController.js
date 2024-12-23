const Post=require('../models/feedSchema');

const createPost=async (req, res) => {
    try {
        


        const { userId, type,description } = req.body;
        let filePath = req.file ? req.file.path : null;

       
        const validTypes = ["image", "video"];
        if (!type || !validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid post type." });
        }
      const newPost = new Post({
        userId: userId, 
        content:filePath, 
        description:description,
        type,
      });
  
      await newPost.save();
      res.status(201).json({ message: "Post created successfully.", post: newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }



  const viewPostById=async(req,res)=>{
try{
    const { userId } = req.query;

const posts=await Post.find({userId:userId});

if (posts.length === 0) {
    return res.status(404).json({ message: 'No posts found for this user' });
  }

  const filteredPosts = posts.map(post => ({
    content: post.content,
    description: post.description,
  }));
  
  res.status(200).json(filteredPosts);

}catch(err){
console.log(err)
}
  }


  const viewPost=async(req,res)=>{
    try{
      
    
    const posts=await Post.find().populate('userId');
   
    if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this user' });
      }
    
 
     
      res.status(200).json(posts);
    
    }catch(err){
    console.log(err)
    }
      }




      
      const postLike = async (req, res) => {
        const { postId } = req.params; 
        const { userId } = req.body; 
      
        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }
      
        try {
         
          const post = await Post.findById(postId);
      
         
          if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
      
          
          if (post.likedBy.includes(userId)) {
            return res
              .status(400)
              .json({ message: "You have already liked this post" });
          }
      
         
          post.likes += 1;
          post.likedBy.push(userId);
      
         
          await post.save();
      
         
          res.status(200).json({
            message: "Post liked successfully",
            likes: post.likes,
            likedBy: post.likedBy,
          });
        } catch (error) {
          
          console.error("Error liking the post:", error);
      
         
          res
            .status(500)
            .json({ message: "Error liking the post", error: error.message });
        }
      };
      
      const postUnlike = async (req, res) => {
        
        const { postId } = req.params;
        const userId = req.body; 
   
        if (!userId) {
          return res.status(401).json({ message: 'Unauthorized: User not logged in' });
        }
      
        try {
          const post = await Post.findById(postId);
      
          if (!post) {
            return res.status(404).json({ message: 'Post not found' });
          }
      
      
      
          post.likes = Math.max(0, post.likes - 1); 
          post.likedBy = post.likedBy.filter((id) => id.toString() == userId.toString());
      
          await post.save();
      
          res.status(200).json({
            message: "Post unliked successfully",
            likes: post.likes,
            likedBy: post.likedBy,
          });
        } catch (error) {
          res.status(500).json({ message: 'Error unliking the post', error: error.message });
        }
      };
      
  module.exports={createPost,viewPostById,viewPost,postLike,postUnlike}