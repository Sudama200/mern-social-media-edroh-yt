import Post from '../models/Post.js'
import User from '../models/User.js';

export const createPost = async (req, res) => {
    try {
        const {userId, description, picturePath} = req.body;
        const user = User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();
        const post = await Post.find(); 
        res.status(201).json(post);
    } catch (error) {
        res.status(409).json({msg: error})
    }
}

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find(); 
        res.status(200).json(post);

        
    } catch (error) {
        res.status(409).json({msg: error})
        
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const {userId} = req.params;
        const posts = await Post.find({userId}); 
        res.status(200).json(posts);
    } catch (error) {
        res.status(409).json({msg: error})
    }
} 

export const likePost = async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        if(isLiked){
            post.likes.delete(userId)
        } else{
            post.likes.set(userId, true)
        }
        const updatedPost = Post.findByIdAndUpdate(id, {likes: post.likes}, {new: true});
        res.status(201).json(updatedPost);
        
    } catch (error) {
        res.status(409).json({msg: error})   
    }
}


