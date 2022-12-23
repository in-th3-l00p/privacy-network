import React, {useContext, useState} from "react";
import {Post} from "../util/serverTypes";
import {Button, ButtonGroup, Col, Row} from "react-bootstrap";
import postService from "../service/postService";
import {AuthenticationContext} from "../util/authentication";

const PostDisplay: React.FC<{ post: Post }> = ({post}) => {
    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${date.getDay()}-${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`;
    }

    const authentication = useContext(AuthenticationContext);
    const [currentPost, setCurrentPost] = useState(post);

    return (
        <div className={"border p-3 bg-white"}>
            <Row>
                <Col>
                    <h4>{typeof post.user !== "undefined" ? post.user.username : "[deleted]"}</h4>
                </Col>
                <Col>
                    <p className={"text-muted"} style={{textAlign: "right"}}>{formatDate(post.postDate)}</p>
                </Col>
            </Row>
            <Row><Col><p>{post.text}</p></Col></Row>
            {authentication.token && (
                <Row>
                    <Col>
                        <ButtonGroup>
                            <Button
                                variant={currentPost.liked ? "secondary" : "dark"}
                                onClick={() => {
                                    postService.likePost(post.id);
                                    const newPost: Post = {...currentPost};
                                    if (currentPost.liked) {
                                        newPost.liked = false;
                                        newPost.likes = newPost.likes - 1;
                                    } else {
                                        newPost.liked = true;
                                        newPost.likes = newPost.likes + 1;
                                        if (currentPost.disliked) {
                                            newPost.dislikes--;
                                            newPost.disliked = false;
                                        }
                                    }
                                    setCurrentPost(newPost);
                                }}
                            >
                                {currentPost.likes} 👍
                            </Button>
                            <Button
                                variant={currentPost.disliked ? "secondary" : "dark"}
                                onClick={() => {
                                    postService.dislikePost(post.id);
                                    const newPost: Post = {...currentPost};
                                    if (currentPost.disliked) {
                                        newPost.disliked = false;
                                        newPost.dislikes = newPost.dislikes - 1;
                                    } else {
                                        newPost.disliked = true;
                                        newPost.dislikes = newPost.dislikes + 1;
                                        if (currentPost.liked) {
                                            newPost.likes--;
                                            newPost.liked = false;
                                        }
                                    }
                                    setCurrentPost(newPost);
                                }}
                            >
                                {currentPost.dislikes} 👎
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default PostDisplay;