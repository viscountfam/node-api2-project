const express = require("express");

const Posts = require("../data/db.js");


const postRouter = express.Router();

//Get requests
postRouter.get('/', (req, res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: 'Error retrieving the posts'
        })
    })
});
// Get by ID
postRouter.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post.length > 0) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: 'Post not found'})
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: 'Error retrieving the post'
        })
    })
})
//Get comment by ID
postRouter.get('/:id/comments', (req, res) => {
    Posts.findCommentById(req.params.id)
    .then(comments => {
        if (comments) {
            res.status(200).json(comments)
        } else {
            res.status(404).json({ message: 'comments not found'})
        }
    })
})



//Post requests
postRouter.post('/:id/comments', (req, res) => {
    let comment = {...req.body, post_id: req.params.id - 1}
    if(!req.body.text){
        res.status(400).json({errorMessage: 'Please provide text for the comment'})
    }
    Posts.insertComment(comment).then(id => {
        res.status(200).json(id)
    }).catch(err => {
        console.log('an error occurred', err);
        res.status(500).json({ errorMessage: 'The post request was unsuccessful'})
    })
})

postRouter.post('/', (req, res) => {
    const userInfo = req.body
     if(!req.body.title || !req.body.contents){
        res.status(400).json({errorMessage: 'Please provide the correct values'})
    } else {
    console.log("this is the request body", req.body)
    Posts.insert(userInfo).then(user => {
        res.status(201).json(user);
    }).catch(err => {
        console.log("The post request was unsuccessful", err)
        res.status(500).json({ errorMessage: 'There was an error while saving the post to the database'})
    })
    }
})

//Delete request

postRouter.delete('/:id', (req, res) => {
    Posts.remove(req.params.id).then(removed => {
        if(removed === 0){
            res.status(404).json({errorMessage: 'The post with the specified ID does not exist.'})
        } else{
            console.log("successful deletion")
            res.status(200).json(removed)
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'The post could not be removed'})
    })

})

//Put request

postRouter.put('/:id', (req, res) => {
    if(!req.body.title || !req.body.contents){
        res.status(400).json({errorMessage: 'Please provide both a title and content'})
    } else {
    Posts.update(req.params.id, req.body).then(count => {
        if(count === 0){
            res.status(404).json({errorMessage: 'The post with the specified ID does not exist'})
        } else {
            res.status(200).json(count)
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'The post information could not be modified'})
    })
}
})

module.exports = postRouter;